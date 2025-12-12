import mongoose, { Schema, Document } from 'mongoose';

interface IMovie extends Document {
  title: string;
  year: number;
  plot: string;
}

const MovieSchema = new Schema<IMovie>({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  plot: { type: String, required: true }
});

const Movie = mongoose.model<IMovie>('Movie', MovieSchema);

async function run() {
  try {
    console.log(`Mongoose version: ${mongoose.version}`);
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27018/test_db?directConnection=true');
    console.log('Connected to MongoDB\n');

    // Clear existing movies
    await Movie.deleteMany({});

    // Create and insert a movie
    const movie = new Movie({
      title: "Back to the Future",
      year: 1985,
      plot: "A time machine is used to travel back in time."
    });

    const result = await movie.save();
    const resultId = result._id as mongoose.Types.ObjectId;
    console.log(`Created movie with ID: ${resultId}\n`);

    // Test various findByIdAndUpdate patterns
    console.log('=== Testing findByIdAndUpdate with different ID formats ===\n');

    // Test 1: Normal usage - passing ObjectId directly
    // Output: Returns the document before update (or null if not found)
    let updated = await Movie.findByIdAndUpdate(
      resultId,
      { $set: { title: "Back to the Future (Updated 1)" } }
    );
    console.log(`1. findByIdAndUpdate(ObjectId): ${updated ? 'Found and updated' : 'Not found'}`);
    console.log(`   Title after update: ${(await Movie.findById(resultId))?.title}\n`);

    // Test 2: Passing ID as string
    // Output: Returns the document before update (or null if not found)
    updated = await Movie.findByIdAndUpdate(
      resultId.toString(),
      { $set: { title: "Back to the Future (Updated 2)" } }
    );
    console.log(`2. findByIdAndUpdate(string): ${updated ? 'Found and updated' : 'Not found'}`);
    console.log(`   Title after update: ${(await Movie.findById(resultId))?.title}\n`);

    // Test 3: Passing { $eq: ObjectId } - Mongoose extracts the ID
    // Output: Returns the document before update (or null if not found)
    updated = await Movie.findByIdAndUpdate(
      { $eq: resultId },
      { $set: { title: "Back to the Future (Updated 3)" } }
    );
    console.log(`3. findByIdAndUpdate({ $eq: ObjectId }): ${updated ? 'Found and updated' : 'Not found'}`);
    console.log(`   Title after update: ${(await Movie.findById(resultId))?.title}\n`);

    // Test 4: Passing { _id: ObjectId } - Mongoose extracts _id value
    // Output: Returns the document before update (or null if not found)
    updated = await Movie.findByIdAndUpdate(
      { _id: resultId },
      { $set: { title: "Back to the Future (Updated 4)" } }
    );
    console.log(`4. findByIdAndUpdate({ _id: ObjectId }): ${updated ? 'Found and updated' : 'Not found'}`);
    console.log(`   Title after update: ${(await Movie.findById(resultId))?.title}\n`);

    // Test 5: Passing { $ne: null } - Mongoose treats this as a valid query
    // Output: Returns the document before update (or null if not found)
    updated = await Movie.findByIdAndUpdate(
      { $ne: null },
      { $set: { title: "Back to the Future (Updated 5)" } }
    );
    console.log(`5. findByIdAndUpdate({ $ne: null }): ${updated ? 'Found and updated' : 'Not found'}`);
    console.log(`   Title after update: ${(await Movie.findById(resultId))?.title}\n`);

    // Test 6: With { new: true } option - returns updated document
    // Output: Returns the updated document
    updated = await Movie.findByIdAndUpdate(
      resultId,
      { $set: { title: "Back to the Future (Updated 6)" } },
      { new: true }
    );
    console.log(`6. findByIdAndUpdate(ObjectId, update, { new: true }): ${updated ? 'Found and updated' : 'Not found'}`);
    console.log(`   Title: ${updated?.title}\n`);

    // Test 7: Non-existent ID
    // Output: Returns null
    const nonExistentId = new mongoose.Types.ObjectId();
    updated = await Movie.findByIdAndUpdate(
      nonExistentId,
      { $set: { title: "This won't exist" } }
    );
    console.log(`7. findByIdAndUpdate(non-existent ID): ${updated ? 'Found' : 'Not found (returns null)'}\n`);

    // Test 8: Invalid format - this should throw an error or return null
    // Output: May throw error or return null depending on mongoose version
    try {
      updated = await Movie.findByIdAndUpdate(
        { _id: { $eq: resultId } } as any,
        { $set: { title: "Back to the Future (Updated 8)" } }
      );
      console.log(`8. findByIdAndUpdate({ _id: { $eq: ObjectId } }): ${updated ? 'Found' : 'Not found'}`);
    } catch (error: any) {
      console.log(`8. findByIdAndUpdate({ _id: { $eq: ObjectId } }): Error - ${error.message}`);
    }

    console.log('\n=== Summary ===');
    console.log('All findByIdAndUpdate variants that accept query objects (like { $eq: id }, { _id: id }, { $ne: null })');
    console.log('successfully extract the ID and perform the update in mongoose 7.5.1.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

run().catch(console.error);

