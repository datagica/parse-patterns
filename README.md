# Parse Patterns

This module extracts patterns from a text and an entity list.

For the moment, we will not try to detect the coordinates in the text,
but we could store the sentence index.

If the list is empty, it will create generic instances of type Entity.

Link have a generic name on purpose, since a word may have different interpretation
depending on the context. This is not a problem if the network is interpreted
by an human (or later a machine learning algorithm like LSTM + RN)

TODO:
- déménagement
- accident
