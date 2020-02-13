import React, { Component } from "react";
import {
  Subscription,
  throwError,
  merge,
  fromEvent,
  of,
  iif,
  forkJoin,
  Observable
} from "rxjs";
import {
  switchMap,
  pluck,
  map,
  filter,
  tap,
  takeUntil,
  finalize,
  expand,
  delay,
  pairwise,
  throttleTime
} from "rxjs/operators";
import styles from "./style.module.scss";
import { TweenLite } from "gsap";

export default class Container extends Component<
  {},
  { withinContainer: boolean }
> {
  public containerRef: React.RefObject<HTMLDivElement> = React.createRef();
  public eventSubscription?: Subscription;

  public state = {
    withinContainer: true
  };

  public down$ = () => {
    return this.containerRef.current
      ? merge(
          fromEvent<TouchEvent>(this.containerRef.current, "touchstart", {
            passive: true
          }),
          fromEvent<MouseEvent>(this.containerRef.current, "mousedown")
        )
      : throwError("No container to attach to");
  };

  public downhandler = (event: TouchEvent | MouseEvent) => {
    return of(event).pipe(
      delay(1000),
      switchMap(
        downEvent =>
          of(this.getDraggableTarget(downEvent.target)).pipe(
            filter((el): el is HTMLElement => !!el),
            switchMap(target => {
              const dataTransfer = new DataTransfer();
              return of(
                this.createDragEvent(downEvent, "dragstart", dataTransfer)
              ).pipe(
                tap(dragStartEvent => {
                  target.dispatchEvent(dragStartEvent);
                }),
                switchMap(dragStartEvent =>
                  of(
                    this.createDragEvent(downEvent, "dragenter", dataTransfer)
                  ).pipe(
                    switchMap(dragEnterEvent =>
                      of(this.createGhostImage(target)).pipe(
                        tap(() => {
                          target.dispatchEvent(dragEnterEvent);
                        }),
                        switchMap(ghostImage =>
                          this.containerRef.current
                            ? forkJoin({
                                target: of(target),
                                ghostImage: of(ghostImage),
                                dataTransfer: of(dataTransfer),
                                offsets: of({
                                  windowX: window.scrollX,
                                  windowY: window.scrollY,
                                  clientX: dragStartEvent.pageX,
                                  clientY: dragStartEvent.pageY
                                })
                              })
                            : throwError("No container to attach to")
                        )
                      )
                    )
                  )
                )
              );
            })
          ) // this is where the takeuntil would go
      )
    );
  };

  public move$ = (
    offsets: { windowX: number; windowY: number },
    ghostImage: HTMLElement,
    dataTransfer: DataTransfer
  ) =>
    merge(
      fromEvent<MouseEvent>(window, "mousemove").pipe(
        tap(event => {
          event.preventDefault();
        })
      ),
      fromEvent<TouchEvent>(window, "touchmove", {
        passive: true
      })
    ).pipe(
      throttleTime(10),
      tap(event => {
        this.moveGhostImage(
          event instanceof TouchEvent ? event.touches[0] : event,
          offsets,
          ghostImage
        );
      }),
      pairwise(),
      switchMap(([prev, current]) => {
        const { clientX: prevX, clientY: prevY } =
          prev instanceof TouchEvent ? prev.touches[0] : prev;

        const { clientX: currentX, clientY: currentY } =
          current instanceof TouchEvent ? current.touches[0] : current;

        this.checkInContainer(currentX, currentY);

        const deltaX = Math.sign(currentX - prevX);
        const deltaY = Math.sign(currentY - prevY);

        return of(this.getCurrentTarget(prevX, prevY)).pipe(
          expand(over =>
            iif(
              () => !!this.containerRef.current,
              of(
                this.checkScroll(
                  this.containerRef.current!,
                  ghostImage,
                  deltaX,
                  deltaY
                )
              ).pipe(
                switchMap(({ x, y }) =>
                  of(this.getCurrentTarget(currentX, currentY)).pipe(
                    switchMap(newOver =>
                      iif(
                        () => over !== newOver,
                        of(newOver).pipe(
                          tap(() => {
                            if (over) {
                              over.classList.remove();
                              over.dispatchEvent(
                                this.createDragEvent(
                                  current,
                                  "dragleave",
                                  dataTransfer
                                )
                              );
                            }
                          }),
                          tap(() => {
                            if (newOver) {
                              newOver.classList.remove();
                              newOver.dispatchEvent(
                                this.createDragEvent(
                                  current,
                                  "dragenter",
                                  dataTransfer
                                )
                              );
                            }
                          })
                        ),
                        of(over)
                      ).pipe(
                        tap(() => {
                          this.scroll(x, y);
                        }),
                        filter(() => !(x === 0 && y === 0))
                      )
                    )
                  )
                )
              ),
              throwError("No contianer to attach to")
            ).pipe(delay(5))
          )
        );
      })
    );

  public up$ = () =>
    merge(
      fromEvent(window, "mouseup"),
      fromEvent(window, "touchend"),
      this.containerRef.current
        ? fromEvent(this.containerRef.current, "contextmenu")
        : throwError("No container to attach to ")
    );

  public componentDidMount() {
    this.down$()
      .pipe(
        switchMap(event =>
          this.downhandler(event).pipe(
            switchMap(({ target, offsets, ghostImage, dataTransfer }) =>
              this.move$(offsets, ghostImage, dataTransfer).pipe(
                finalize(() => {
                  if (this.containerRef.current) {
                    this.containerRef.current.removeChild(ghostImage);
                  }
                })
              )
            ),
            takeUntil(this.up$())
          )
        )
      )
      .subscribe({
        next(c) {
          //    console.log(c);
        },
        error(e) {
          console.log(e);
        },
        complete() {
          console.log("done");
        }
      });
  }

  // clean up subscription
  public componentWillUnmount() {}

  public checkInContainer = (x: number, y: number) => {
    if (this.containerRef.current) {
      const withinContainer = this.containerRef.current.contains(
        document.elementFromPoint(x, y)
      );

      this.setState(prevState => {
        if (prevState.withinContainer === withinContainer) {
          return null;
        }
        return {
          withinContainer
        };
      });

      return withinContainer;
    }
    throw new Error("No container to attach to");
  };

  public getCurrentTarget = (clientX: number, clientY: number) =>
    this.getDraggableTarget(document.elementFromPoint(clientX, clientY));

  public createDragEvent = (
    event: TouchEvent | MouseEvent,
    type: string,
    dataTransfer: DataTransfer
  ) => {
    const dragEvent = new DragEvent(type, event);

    Object.defineProperty(dragEvent, "dataTransfer", {
      value: dataTransfer,
      writable: false
    });

    if (event instanceof TouchEvent && type !== "drgagend") {
      this.copyFirstTouchProps(event as TouchEvent, dragEvent);
    }

    return dragEvent;
  };

  public copyFirstTouchProps = (event: TouchEvent, dragEvent: DragEvent) =>
    of(event).pipe(
      pluck("touches", "0"),
      map((fistTouchProperties: any) => {
        for (const i in fistTouchProperties) {
          if (i !== "target") {
            Object.defineProperty(dragEvent, i, {
              value: fistTouchProperties[i],
              writable: false
            });
          }
        }

        return dragEvent;
      })
    );

  public checkScroll = (
    container: HTMLElement,
    ghostImage: HTMLElement,
    deltaX: number,
    deltaY: number
  ) => {
    const containerRect = container.getBoundingClientRect();
    const ghostImageRect = ghostImage.getBoundingClientRect();

    const x = 0;

    const y =
      containerRect.top > ghostImageRect.top &&
      container.scrollTop > 0 &&
      deltaY < 0
        ? -1
        : containerRect.bottom < ghostImageRect.bottom &&
          container.scrollHeight -
            (container.scrollTop + container.offsetHeight) >
            0 &&
          deltaY > 0
        ? 1
        : 0;

    return {
      x,
      y
    };
  };

  public createGhostImage = (target: HTMLElement) => {
    const ghostImage = target.cloneNode(true) as HTMLElement;

    ghostImage.style.position = "fixed";
    ghostImage.style.pointerEvents = "none";
    ghostImage.style.border = "3px solid black";
    ghostImage.style.margin = "0";
    ghostImage.style.top = target.getBoundingClientRect().top.toString();
    ghostImage.style.left = target.getBoundingClientRect().left.toString();

    if (this.containerRef.current) {
      this.containerRef.current.insertBefore(ghostImage, target);
      return ghostImage;
    }
    throw new Error("No container to attach to ");
  };

  public moveGhostImage = (event: any, offsets: any, ghostImage: any) => {
    if (this.containerRef.current) {
      const y = event.clientY - offsets.clientY + offsets.windowY;

      TweenLite.to(ghostImage, 0, {
        y,
        background: "blue"
      });
    }
  };

  public getDraggableTarget = (element: any): HTMLElement | null => {
    if (element) {
      if (
        element.hasAttribute("react-draggable") &&
        !!JSON.parse(element.attributes["react-draggable"].value)
      ) {
        return element;
      } else if (!element.parentElement) {
        return null;
      }

      return this.getDraggableTarget(element.parentElement);
    }

    return null;
  };

  public scroll = (x: number, y: number) => {
    const container = this.containerRef.current;

    if (container) {
      TweenLite.to(container, 0, {
        scrollTop: container.scrollTop + 7 * y,
        scrollLeft: container.scrollLeft + 7 * x
      });

      return;
    }
    throw new Error("No container to attach to");
  };

  public render() {
    return (
      <div ref={this.containerRef} className={styles.rxcont}>
        <div
          react-draggable="true"
          in-dec={3}
          onDragEnter={e => {
            console.log("enter");
            e.preventDefault();
          }}
          onDragStart={e => {
            e.preventDefault();
            console.log("start");
            e.dataTransfer.setData("dragContent", "ssjdfsd");
          }}
          className={styles.other}
        >
          first
        </div>

        <div
          react-draggable="true"
          onDragStart={e => {
            e.preventDefault();

            e.dataTransfer.setData("dragContent", "ssjdfsd");
          }}
          className={styles.other}
        >
          second
        </div>

        <div
          tabIndex={0}
          react-draggable="true"
          onDragStart={e => {
            e.preventDefault();

            e.dataTransfer.setData("dragContent", "ssjdfsd");
          }}
          className={styles.other}
        >
          <button
            onClick={e => {
              e.stopPropagation();
            }}
            onMouseDown={e => e.stopPropagation()}
          >
            CLick
          </button>
        </div>

        <div
          react-draggable="true"
          onDragStart={e => {
            e.preventDefault();

            e.dataTransfer.setData("dragContent", "ssjdfsd");
          }}
          className={styles.other}
        >
          fourth
        </div>
      </div>
    );
  }
}
