import * as migration_20260918_124310_initial from './20260918_124310_initial';

export const migrations = [
  {
    up: migration_20260918_124310_initial.up,
    down: migration_20260918_124310_initial.down,
    name: '20260918_124310_initial'
  },
];
