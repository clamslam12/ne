//invoked on client side
//can use jQuery, Vue, Angular, React or any front end frameworks here
$(document).ready(() => {
  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get("/courses?format=json", (data) => {
      data.forEach((course) => {
        $(".modal-body").append(
          `<div>
                          <span class="course-title">
                              ${course.title}
                          </span>
                          <div class="course-description">
                              ${course.description}
                          </div>
                      </div>`
        );
      });
    });
  });
});
