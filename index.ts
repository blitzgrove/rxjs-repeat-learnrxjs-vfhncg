import { switchMap, take, repeat, delay, takeUntil, map, takeWhile, multicast } from 'rxjs/operators';
import { EMPTY, of, ReplaySubject, concat, forkJoin } from 'rxjs';
console.clear();

const source = of('source');
const delayedThing = of('delayed value');

function getObs() {
  let p = 0;
  return source.pipe(
    switchMap(_ => {
      return delayedThing.pipe(
        map(r => { p++; return r }),
        delay(500),
        repeat(),
        takeWhile(r => p < 5, true),
        switchMap(r => {
          if (p === 5) {
            return of('last value');
          }
          return EMPTY;
        })
      )
    })
  );
}

forkJoin(getObs(), getObs())
.subscribe(
  res => console.log(res),
  null,
  () => console.log('done')
);

