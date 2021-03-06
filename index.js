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
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
  category: {
    type: String,
    enum: ["web", "mobile", "network"],
    required: true,
    // lowercase:true
    // uppercase:true
    // trim:true
  },
  author: String,
  tags: {
    type: Array,
   
    validate: {
      isAsync: true,
      validator: function (v, callback) {
        setTimeout(() => {
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: " A course should have atleast one tag.",
    },
  },
  date: { type: Date, default: Date.now },

  isPublished: Boolean,
  price: {
    type: Number,
    min: 10,
    max: 200,
    get:v=>Math.round(v),
    set:v=>Math.round(v),
    required: function () {
      return this.isPublished;
    },
  },
});

// Creating a model

// Step 1 -> making a class of the schema
const Course = mongoose.model("Course", courseSchema);
async function createCourse() {
  // Step 2 -> Making object of the class .
  const course = new Course({
    name: "React.js Course",
    author: "Yashraj Jain",
    tags: ['frontend'],
    isPublished: true,
    category: "web",
    price: 15.8,
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for(field in ex.errors)
      {
        console.log(ex.errors[field].message);
      }
  }
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
// update the course
async function updateCourse(id) {
  // Approach 2 : Update First -> Update Directly
  const result = await Course.updateMany(
    { _id: id },
    {
      $set: {
        author: "Yash",
        isPublished: false,
      },
    }
  );
  console.log(result);
}

// Remove Course
async function removeCourse(id) {
  // Approach 2 : Update First -> Update Directly
  const result = await Course.deleteOne({ _id: id });
  console.log(result);
}
createCourse();
