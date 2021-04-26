//client side rendering; executed by browser

//can use any client side framework such as: jQuery, React, Vue, Angular
$(document).ready(() => {
  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get("/api/courses", (results = {}) => {
      let data = results.data;
      //base case; no need to use else statement
      if (!data || !data.courses) return;
      data.courses.forEach((course) => {
        $(".modal-body").append(
          `<div>
                    <span class="course-title">
                        ${course.title}
                    </span>
                    <span class="course-cost">
                        $${course.cost}
                    </span>
                    <button class='button ${course.joined ? "joined-button" : "join-button"}' data-id="${course._id}">
						${course.joined ? "Joined" : "Join"}
					</button>
                    <div class="course-description">
                        ${course.description}
                    </div>
          </div>`
        );
      });
    }).then(() => {
      addJoinButtonListener();
    });
  });
});

let addJoinButtonListener = () => {
  $(".join-button").click((event) => {
    let $button = $(event.target),
      //comes from data-id attribute of bootstrap
      courseId = $button.data("id");
    console.log(`/api/courses/${courseId}/join`);
    //do a get request to the following route
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      let data = results.data;
      if (data && data.success) {
        $button
          .text("Joined")
          .addClass("joined-button")
          .removeClass("join-button");
      } else {
        $button.text("Try again");
      }
    });
  });
};
