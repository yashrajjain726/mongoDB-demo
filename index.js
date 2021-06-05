const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/playground", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log("Couldnot connect to database", err));

// Defining schema for database
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

// Creating a model

// Step 1 -> making a class of the schema
const Course = mongoose.model("Course", courseSchema);
async function createCourse() {
  // Step 2 -> Making object of the class .
  const course = new Course({
    name: "React.js Course",
    author: "Yashraj Jain",
    tags: ["react", "frontend"],
    isPublished: true,
  });

  const result = await course.save();
  console.log(result);
}

async function getCourses() {
  // Comparision Operators - >
  // {
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt   (less than)
  // lte  (less than or equal to)
  // in
  // nin  (not in)
  // or
  // and
  // for example -> Course.find({price:{$gt:10}})
  // }



  // Fetch the course in which 
  // author starts with Yash -> Course.find({author:/^Yash/})
  // author ends with Jain -> Course.find({author:/Jain$/}) 
  // author contains raj -> Course.find({/.*raj.*/})
  const courses = await Course.find({
    author: "Yashraj Jain",
    isPublished: "true",
  })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
}
getCourses();
