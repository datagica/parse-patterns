// source/licence: Apache License
// https://github.com/ucscXena/static-interval-tree/blob/master/js/index.js

// A simple static interval tree: static in the sense that
// we only do bulk loading, no add/remove after initial load.
//
// Because we don't support add/remove, we don't need a binary tree
// implementation that retains balance during add/remove (avl, red-black). Instead we
// can sort, then build a tree from the sort.

'use strict'

// Build a balanced binary tree from an ordered array.
function toTree (arr, low, high) {
  if (low >= high) { return }
  const mid = Math.floor((high + low) / 2)
  return {
    el   : arr[mid],
    right: toTree(arr, mid + 1, high),
    left : toTree(arr, low, mid)
  };
}

function getHigh ({high} = {high: -Infinity}) { return high }

// Find the highest end value of each node. Mutates its input.
function findEnd (node) {
  if (!node) { return }
  const {left, right, el} = node
  findEnd(left)
  findEnd(right)
  node.high = Math.max(getHigh(left), getHigh(right), el.end)
  return node
}

function cmp (x, y) { return x === y ? 0 : (x < y ? -1 : 1) }

// Build index.
// intervals :: [{begin, end, ...}, ...]
function index (intervals) {
  const sorted = intervals.slice(0).sort((a, b) => cmp(a.begin, b.begin))
  return findEnd(toTree(sorted, 0, sorted.length))
}

function matchesAcc (node, pos, acc) {
  if (node) {
    const {begin, end} = pos
    if (node.high >= begin) {
      if (end >= node.el.begin) {
        if (node.el.end >= begin) {
          acc.push(node.el)
        }
        matchesAcc(node.right, pos, acc)
      }
      matchesAcc(node.left, pos, acc)
    }
  }
  return acc
}

// Find intervals in node overlapping position.
// pos :: {begin, end}
function matches (node, pos) { return matchesAcc(node, pos, []) }

function matches01Acc (node, pos, acc) {
  if (node) {
    const {begin, end} = pos
    if (node.high > begin) {
      if (end > node.el.begin) {
        if (node.el.end > begin) {
          acc.push(node.el)
        }
        matches01Acc(node.right, pos, acc)
      }
      matches01Acc(node.left, pos, acc)
    }
  }
  return acc
}

// Find intervals in node overlapping position, using half-open coords.
// We could also support this by parameterizing the compare fn, though that adds
// more function calls to what is expected to be a hot loop.
// pos :: {begin, end}
function matches01 (node, pos) { return matches01Acc(node, pos, []) }

function arrToTree (arr) { return toTree(arr, 0, arr.length) }

module.exports = {
  matches  : matches,
  matches01: matches01,
  index    : index,
  toTree   : arrToTree
}
