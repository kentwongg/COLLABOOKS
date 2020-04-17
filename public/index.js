/********** SENG513 Final Project **********
*  Members: Jasmine Cronin
*           Brandt Davis
*           Patrick Matchett
*           Ashley Millette
*           Siobhan O’Dell
*           Kent Wong
*  Created On: 11/03/2020
*  Last revision: 08/04/2020
********************************************/

/*************Global Variables**************/
let map;
let markers = initMarkers();

/************* Initializations **************/
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.078113, lng: -114.129029},
      zoom: 15
    });
}


/************* Google maps functions ********/
//creating a closure that will handle all of the marker functions
function initMarkers(){
  let bookIcon = 'https://maps.google.com/mapfiles/kml/shapes/library_maps.png';
  //list of markers, needed to keep track of them
  let markers = [];
  let markerId = 0;
  function addMarker(book){
    let markerPosition = {lat:book.latitude, lng:book.longitude};
    let marker = new google.maps.Marker({position:markerPosition, map:map, icon: bookIcon});
    //This string will change once we know more about what information we want to show
    let bookInfo = "<b>Title:</b> " + book.title + "<br><b>Author:</b> " + book.author + "<br><b>Status:</b> " + book.status;
    //Only adding the button to rent a book if it is currently available
    if(book.status === "in"){
      //when the button is pressed it will call the function loanHandler with the book identifiers as an argument
      bookInfo = bookInfo + "<br><button type='button' onclick='loanHandler("+book.ISBN+")' class='loanButton'>Ask to loan</button>";
      //'loanHandler("+book+")'
    }
    let infoWindow = new google.maps.InfoWindow({content: bookInfo});
    marker.addListener("click", function(){
      infoWindow.open(map, marker);
    });
    markers.push({id:markerId, marker:marker});
    markerId++;
  }


  function removeMarker(id){
    for(let tempIndex in markers){
      if(markers[tempIndex].id === id){
        markers[tempIndex].marker.setMap(null);
        markers[tempIndex].marker = null
        markers.splice(tempIndex, 1);
        return;
      }
    }
  }

  function modifyMarker(){

  }

  return {addMarker, removeMarker, modifyMarker}
}

/************* Event Handling functions *****/
//this function currently has placeholder functionality
function loanHandler(identifier){
  console.log("called loan handler");
  console.log(identifier);
}

/************* Page Navigation **************/

/**Changes to the selected tab on the navbar**/
$(document).on('click','.nav li', function (e) {
    $(this).addClass('active').siblings().removeClass('active');

    if ($(this).text() === "Home") {
      $('.HomePage').show();
      $('.BookshelfPage').hide();
      $('.RequestsPage').hide();
      $('.ProfilePage').hide();
      initMap();
    }
    else if ($(this).text() === "Bookshelf") {
      $('.HomePage').hide();
      $('.BookshelfPage').show();
      $('.RequestsPage').hide();
      $('.ProfilePage').hide();
    }
    else if ($(this).text() === "Requests") {
      $('.HomePage').hide();
      $('.BookshelfPage').hide();
      $('.RequestsPage').show();
      $('.ProfilePage').hide();
    }
    else if ($(this).text() === "My Profile") {
      $('.HomePage').hide();
      $('.BookshelfPage').hide();
      $('.RequestsPage').hide();
      $('.ProfilePage').show();
    }

} );

/************* Placeholder Functions **************/

async function populateShelf()
{
  // TODO: Use cookies to keep track of current user?
  const currentUser = "10";

  const allBooks = await apiGetBookTable();

  // TODO: this is pretty ugly, can we make it nicer or you just HAVE to get all the books?
  for(var key in allBooks) {
    var owner = allBooks[key].owner_id;
    if(owner === currentUser){

      let status = allBooks[key].borrowed_by;

      if(status === "null"){
        status = "None";
      }

      $('#bookshelf > tbody').append($('<tr>').html(
        "<td>" + allBooks[key].title + "</td>" +
        "<td>" + allBooks[key].author + "</td>" +
        "<td>" + allBooks[key].isbn + "</td>" +
        "<td>" + status + "</td>" +
        '<td><button type="button" class="btn btn-secondary" name="removeBook" onclick="removeBook(' + key + ')">Remove</button></td>'
        ));
    }
  }
}

// TODO: connect to database
async function populateBooksAround()
{
  const users = await apiGetUserTable();
  console.log(typeof users);
  console.log(users);
  console.log(users[0].user_lon);

  books.forEach((item, i) => {
    $('#booksidebar > tbody').append($('<tr>').html(
      "<td>" + item.title + "</td>" +
      "<td>" + item.author + "</td>" +
      "<td>" + item.status + "</td>"
      ));
    markers.addMarker(item);
  });

}

// TODO: connect to database
function removeBook(removeISBN){
  console.log("Removed " + removeISBN);
}
