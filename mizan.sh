#!/bin/bash
npm run server --prefix ~/projects/mizan.next & npm run client --prefix ~/projects/mizan.next; npx pouchdb-server --sqlite;
