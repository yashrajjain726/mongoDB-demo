const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/mongo-exercises", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log("Not connected to the Database", err));

const courseSchema = new mongoose.Schema({
  name: String,
  tags: [String],
  date: Date,
  author: String,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Course", courseSchema);
async function getCourses() {
  return await Course.find({
    isPublished: true,
  })
    .or([{ price: { $gte: 15 } }, { name: /.*by.*/i }])
    .sort({ price: -1 })
    .select({ name: 1, author: 1,price:1 });
}
async function run() {
  const courses = await getCourses();
  console.log(courses);
}
run();
