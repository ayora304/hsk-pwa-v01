import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function compile(name, dependencies = {}, extras = {}) { const source=readFileSync(new URL('../src/data/'+name+'.ts',import.meta.url),'utf8');const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;const exports={};vm.runInNewContext(output,{exports,require:name=>{if(name in dependencies)return dependencies[name];throw Error('Unexpected dependency: '+name);},...extras});return exports; }
const model=compile('learningState');
test('empty state has no demo progress or fake messages',()=>{const state=model.emptyLearningState();assert.equal(state.messages.length,0);assert.equal(state.notes.length,0);const stats=model.learningStats(state);assert.equal(stats.quizCount,0);assert.equal(stats.accuracy,null);assert.equal(stats.streak,0);});
test('real attempts derive accuracy, practiced words and streak without double counting',()=>{const state=model.emptyLearningState();const now=new Date(2026,9,31,12).getTime();state.attempts=[{id:'a',correct:2,total:4,seconds:90,createdAt:now,words:['你好','谢谢']},{id:'b',correct:1,total:4,seconds:30,createdAt:now-86400000,words:['谢谢']}];const stats=model.learningStats(state,now);assert.equal(stats.accuracy,38);assert.equal(stats.words,2);assert.equal(stats.streak,2);assert.equal(stats.minutes,2);assert.equal(model.readLearningState(JSON.stringify(state)).attempts.length,2);});
test('corrupt and unsupported storage is rejected rather than silently overwritten',()=>{assert.throws(()=>model.readLearningState('{broken'));assert.throws(()=>model.readLearningState('{"version":9}'));});
test('saved notes survive store reload; storage failures do not erase earlier records',()=>{const entries=new Map();let full=false;const storage={getItem:key=>entries.get(key)||null,setItem:(key,value)=>{if(full)throw Error('full');entries.set(key,value);}};const listeners={};const extras={localStorage:storage,window:{addEventListener:(event,handler)=>{listeners[event]=handler;}}};const deps={'react':{useSyncExternalStore:(_subscribe,get)=>get()},'./learningState':model};const store=compile('learningStore',deps,extras);store.updateLearning(state=>({...state,notes:[{id:'note',title:'My own note',body:'你好吗',tag:'HSK 1',type:'folder',date:'Today',duration:'3 words',updatedAt:1}]}));const reloaded=compile('learningStore',deps,extras);assert.equal(reloaded.useLearning().notes[0].body,'你好吗');full=true;assert.throws(()=>reloaded.updateLearning(state=>({...state,notes:[]})));assert.equal(reloaded.useLearning().notes.length,1);assert.match(reloaded.useStorageError(),/full or unavailable/);assert.equal(JSON.parse(entries.get('hsk-learning-v1')).notes.length,1);});

test('legacy saves gain an empty diamond wallet without retroactive rewards',()=>{
  const legacy=model.emptyLearningState();delete legacy.wallet;
  legacy.attempts=[{id:'old',correct:4,total:4,seconds:60,createdAt:1,words:['谢谢']}];
  const migrated=model.readLearningState(JSON.stringify(legacy));
  assert.equal(migrated.wallet.diamonds,0);assert.equal(migrated.wallet.transactions.length,0);
  assert.equal(migrated.attempts[0].id,'old');
});

test('completed quizzes award ten diamonds once per saved attempt and survive reload',()=>{
  const attempt={id:'quiz-a',correct:0,total:4,seconds:30,createdAt:1,words:[]};
  const saved=model.recordQuizCompletion(model.emptyLearningState(),attempt);
  assert.equal(saved.wallet.diamonds,10);assert.equal(saved.wallet.transactions.length,1);
  assert.equal(saved.wallet.transactions[0].quizAttemptId,'quiz-a');
  const retried=model.recordQuizCompletion(model.readLearningState(JSON.stringify(saved)),attempt);
  assert.equal(retried.wallet.diamonds,10);assert.equal(retried.attempts.length,1);
  const next=model.recordQuizCompletion(retried,{...attempt,id:'quiz-b'});
  assert.equal(next.wallet.diamonds,20);assert.equal(next.wallet.transactions.length,2);
});

test('invalid diamond balances are rejected instead of silently reset',()=>{
  for(const diamonds of [-1,1.5,'10',Number.MAX_SAFE_INTEGER+1]) {
    const state=model.emptyLearningState();state.wallet.diamonds=diamonds;
    assert.throws(()=>model.readLearningState(JSON.stringify(state)),/diamond balance/);
  }
});

test('failed quiz persistence awards nothing and a successful retry awards once',()=>{
  const entries=new Map();let full=true;
  const extras={localStorage:{getItem:key=>entries.get(key)||null,setItem:(key,value)=>{if(full)throw Error('full');entries.set(key,value);}},window:{addEventListener:()=>{}}};
  const deps={'react':{useSyncExternalStore:(_subscribe,get)=>get()},'./learningState':model};
  const store=compile('learningStore',deps,extras);
  const attempt={id:'quiz-retry',correct:3,total:4,seconds:50,createdAt:1,words:['谢谢']};
  assert.throws(()=>store.updateLearning(s=>model.recordQuizCompletion(s,attempt)));
  assert.equal(store.useLearning().wallet.diamonds,0);assert.equal(store.useLearning().attempts.length,0);
  full=false;store.updateLearning(s=>model.recordQuizCompletion(s,attempt));
  store.updateLearning(s=>model.recordQuizCompletion(s,attempt));
  const reloaded=compile('learningStore',deps,extras);
  assert.equal(reloaded.useLearning().wallet.diamonds,10);assert.equal(reloaded.useLearning().attempts.length,1);
});
