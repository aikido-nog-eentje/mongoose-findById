# Mongoose 7.5.1 findByIdAndUpdate Behavior Test

This test suite demonstrates how `findByIdAndUpdate` behaves in mongoose 7.5.1 when passed different ID formats, including query objects.

## Setup

1. **Start MongoDB**:
   ```bash
   docker compose up -d
   ```
   Wait a few seconds for MongoDB to initialize.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the test**:
   ```bash
   npm test
   ```
   Or separately:
   ```bash
   npm run build
   npm start
   ```

## What This Tests

The script tests various ways to call `findByIdAndUpdate`:

1. **Normal usage**: `findByIdAndUpdate(ObjectId, update)`
2. **String ID**: `findByIdAndUpdate(string, update)`
3. **Query object with $eq**: `findByIdAndUpdate({ $eq: ObjectId }, update)`
4. **Query object with _id**: `findByIdAndUpdate({ _id: ObjectId }, update)`
5. **Query object with $ne**: `findByIdAndUpdate({ $ne: null }, update)`
6. **With new option**: `findByIdAndUpdate(ObjectId, update, { new: true })`
7. **Non-existent ID**: Returns null
8. **Invalid nested query**: `findByIdAndUpdate({ _id: { $eq: ObjectId } }, update)`

## Key Findings

In mongoose 7.5.1, `findByIdAndUpdate` accepts various formats:
- Direct ObjectId
- String representation of ObjectId
- Query objects like `{ $eq: ObjectId }`, `{ _id: ObjectId }`, `{ $ne: null }`

Mongoose extracts the ID from these query objects and performs the update. This behavior is important to understand for security considerations, as it means `findByIdAndUpdate` may accept query objects that could potentially be manipulated.

## Cleanup

To stop MongoDB:
```bash
docker compose down
```

To remove volumes (clean slate):
```bash
docker compose down -v
```

