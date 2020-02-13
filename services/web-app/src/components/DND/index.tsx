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
}
