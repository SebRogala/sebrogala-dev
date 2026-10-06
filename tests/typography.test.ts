import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bindOneLetterWords } from '../src/lib/typography.ts';

const NBSP = ' ';
const page = (body: string) => `<html><head><title>t</title></head><body>${body}</body></html>`;
const bodyOf = (html: string) => html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'));
const bind = (body: string) => bodyOf(bindOneLetterWords(page(body)));

test('binds "I" to the next word', () => {
  assert.equal(bind('<p>so I build it</p>'), `<p>so I${NBSP}build it</p>`);
});

test('binds a lowercase "a" to the next word', () => {
  assert.equal(bind('<p>it is a test</p>'), `<p>it is a${NBSP}test</p>`);
});

test('binds a sentence-initial "A" to the next word', () => {
  assert.equal(bind('<p>A role rarely</p>'), `<p>A${NBSP}role rarely</p>`);
});

test('binds consecutive one-letter words into one chain', () => {
  assert.equal(bind('<p>x I a y</p>'), `<p>x I${NBSP}a${NBSP}y</p>`);
});

test('replaces a source line break after "I" with one no-break space', () => {
  assert.equal(bind('<p>so I\n      build</p>'), `<p>so I${NBSP}build</p>`);
});

test('binds "I" after an opening bracket or quote', () => {
  assert.equal(bind('<p>(I think) “I know”</p>'), `<p>(I${NBSP}think) “I${NBSP}know”</p>`);
});

test('leaves a capital I that starts a longer word alone', () => {
  assert.equal(bind('<p>In Image I</p>'), '<p>In Image I</p>');
});

test('leaves a contraction alone', () => {
  assert.equal(bind("<p>I'm here</p>"), "<p>I'm here</p>");
});

test('leaves a one-letter word inside a longer word alone', () => {
  assert.equal(bind('<p>data at</p>'), '<p>data at</p>');
});

test('binds a trailing one-letter word to a following inline element', () => {
  assert.equal(bind('<p>a <a href="/m">memo</a></p>'), `<p>a${NBSP}<a href="/m">memo</a></p>`);
});

test('leaves a trailing one-letter word before a closing tag alone', () => {
  assert.equal(bind('<p>plan a </p>'), '<p>plan a </p>');
});

test('leaves a trailing one-letter word before a block element alone', () => {
  assert.equal(bind('<li>plan a <div>x</div></li>'), '<li>plan a <div>x</div></li>');
});

test('leaves attribute values alone', () => {
  assert.equal(bind('<img alt="so I build a thing">'), '<img alt="so I build a thing">');
});

test('leaves code contents alone', () => {
  assert.equal(bind('<code>if I build</code>'), '<code>if I build</code>');
});

test('leaves script contents alone', () => {
  assert.equal(bind('<script>const a = 1;</script>'), '<script>const a = 1;</script>');
});

test('leaves style contents alone', () => {
  assert.equal(bind('<style>a b { color: red }</style>'), '<style>a b { color: red }</style>');
});

test('resumes binding after a code element closes', () => {
  assert.equal(bind('<p><code>x</code> so I build</p>'), `<p><code>x</code> so I${NBSP}build</p>`);
});

test('leaves the head alone', () => {
  const html = '<html><head><title>So I build</title></head><body><p>So I build</p></body></html>';
  assert.equal(
    bindOneLetterWords(html),
    `<html><head><title>So I build</title></head><body><p>So I${NBSP}build</p></body></html>`,
  );
});

test('leaves comments alone', () => {
  assert.equal(bind('<!-- so I build -->'), '<!-- so I build -->');
});
