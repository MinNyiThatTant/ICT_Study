$(document).ready(function(){
  $('.delete-article').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/articles/'+id,
      success: function(response){
        alert('Deleting Article');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
    $.ajax({
      type:'DELETE',
      url: '/trainers/'+id,
      success: function(response){
        alert('Deleting Trainers');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });


  $("#wrapper").addClass('toggled');
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });
  // $("#toggleSidebar").click(function(){
  //   document.getElementById('sidebar').classList.toggle('active');
  // });
});

// $("#menu-toggle").click(function(e) {
//   console.log("sidebar works");
//   e.preventDefault();
//   $("#wrapper").toggleClass("toggled");
// });
