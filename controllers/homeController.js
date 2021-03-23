var courses = [
  {
    title: "Rasberry Cake",
    cost: 50,
  },
  {
    title: "Burger",
    cost: 100,
  },
  {
    title: "Artichoke",
    cost: 20,
  },
];
exports.showCourses = (req, res) => {
  res.render("courses", { offeredCourses: courses });
};

exports.showSignUp = (req, res) => {
  res.render("contact");
};
exports.postedSignUpForm = (req, res) => {
  res.render("thanks");
};
exports.showIndex = (req, res) => {
  res.render("index");
};
exports.logRequestPaths = (req, res, next) => {
  console.log(`request made to: ${req.url}`);
  next();
};