export default function(name) {
  return (
    this.fieldValidators[name].validator &&
    typeof this.fieldValidators[name].validator === 'function'
  );
}