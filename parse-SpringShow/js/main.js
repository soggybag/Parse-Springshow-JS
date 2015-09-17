/* 

Todo: 
	
	Like and My Spring Show buttons	
		Get Like count for each post
		Make Like Icon
		Change like button to icon
		Make Springshow icon
		Change My Spring show to button
		Style like icon to highlight to show current user likes
		Style My Springshow to hight for current user spring show picks
		
	Profile page 
		Show current user's likes
			need function to get likes for current user
		Show current user's Springshow picks
			need function to get spring show picks for current user
		
	Alert View
		Add a view for alert messages
			needs function and style to place it and fade it away
	
	Add New Post Container
		Limit text in textarea to 128 characters
			add character count
	
	Define variables for user profile
		spring show array
		like array
		posts array
		
	Define color palette
			
*/

// **********************************************************************************
// Set initial number of posts to load 
// **********************************************************************************

// Init Parse with keys
Parse.initialize("Y11pFemQTSvT81ACSsAH92m31sGHiTDLjGczOZB7", "5Hzk1JhTSLNwd7fO8VkARxMV1plNLdOW206IkHQo");

// Set posts to show per page
var postsToLoadCount = 10;

// Compile templates
var postTemplate = Handlebars.compile($("#post-tmpl").html());
/*
	Compile a Handlebars template before use by passing the text of the 
	template to Handlebars.compile(). Here I get the text of the template 
	by it's id name and pass it into the function. 
	
	Compiling a template creates a function that will generate the template 
	text. This function accepts an object with properties that are inserted 
	into the template.
	
	See the function: getTemplateWith(post) below. 
*/


// **********************************************************************************
// View Management
// **********************************************************************************

// TODO: Change Bar button from to login Maybe add ? to profile icon image

function showProfile() {
	// console.log("show profile:"+Parse.User.current());
	var user = Parse.User.current();
	if (user) {
		getUserProfileForCurrentUser();
		showScreen("#user-profile-container");
	} else {
		showScreen("#login-container");
	}
}

function showAndRefreshPosts() {
	showScreen("#posts-container");
	updateComments();
}


// Show and hide login signup and logout
function showLogin() {
	// console.log("Show Login");
	showScreen("#login-container");
}

function showSignup() {
	// console.log("Show Signup");
	showScreen("#signup-container");
}

function showScreen(screen) {
	$("#main>.screen").hide();
	$(screen).show();
}








// ***************************************************************
// jQuery set up
// ***************************************************************

$(function() {
	
	// -------------------------------------------------------
	// Comment form Submit handler
	// -------------------------------------------------------
	$("#comment-form").submit(function(event){
		event.preventDefault();
		if (Parse.User.current()) {
			addPost();
		} else {
			alert("You must login before you can post");
			console.log("! Need to login before you can post !");
		}
	});
	
	// ----------------------------------------------------------
	// Login Submit handler
	// ----------------------------------------------------------
	$("#login").submit(function(event){
		var name = $("#login-name").val();
		var pass = $("#login-password").val();
		login(name, pass);
		event.preventDefault();
	});
	
	// ------------------------------------------------------------
	// Sign up Submit Handler
	// ------------------------------------------------------------
	$("#signup").submit(function(event) {
		// console.log("*** Sign in submit ***");
		event.preventDefault();
		var name 		= $("#signup-name").val();
		var email 		= $("#signup-email").val();
		var password 	= $("#signup-password").val();
		var studentId 	= $("#student-id-input").val();
		var firstName 	= $("#first-name-input").val();
		var lastName 	= $("#last-name-input").val();
		
		signup(name, email, password, studentId, firstName, lastName);
	});
	
	// --------------------------------------------------------
	// Log out button
	// --------------------------------------------------------
	$("#logout").click(function(){
		// console.log("Log out button");
		Parse.User.logOut();
		setLoginStatus();
		showProfile();
	});
	
	$("#show-login").click(function(event){
		event.preventDefault();
		showLogin();
	});
	
	$("#show-signup").click(function(event){
		event.preventDefault();
		// TODO: Fix sign up thing
		showSignup();
	});
	
	// --------------------------------------------------------
	// Like button
	// --------------------------------------------------------
	$("#posts").on("click", ".like-button", function(event) {
		var postId = $(this).parent().attr("data-id");
		// console.log("liking post:", postId);
		like(postId);
		var likeTextSpan = $(this).find(".like-text");
		var likeCountSpan = $(this).find(".like-count");
		var likeCount = Number(likeCountSpan.html());
		if (likeTextSpan.html() == "Like") {
			likeTextSpan.html("Unlike");
			likeCount ++;
		} else {
			likeTextSpan.html("Like");
			likeCount --;
		}
		likeCountSpan.html(likeCount);
	});
	
	// --------------------------------------------------------
	// My Spring Show Button 
	// --------------------------------------------------------
	$("#posts").on("click", ".my-springshow-button", function(event) {
		// console.log("My Spring show button");
		var postId = $(this).parent().attr("data-id");
		addToMySpringshow(postId);
		
	});
	
	// -------------------------------------------------------
	// Load More link handler
	// -------------------------------------------------------
	$("#posts").on("click", "#load-more", function(event) {
		event.preventDefault();
		// console.log("Load More Posts");
		// load the next group of images
		postsToLoadCount += 10;
		updateComments();
	});
	
	// -------------------------------------------------------
	// User Profile 
	// -------------------------------------------------------
	$("#user-profile-container").on("click", "#show-user-posts", function(event){
		event.preventDefault();
		// console.log("Show Posts for user");
		showPostsForUser();
        scrollToProfilePostsContainer();
	});
    
    function scrollToProfilePostsContainer() {
        var distanceToTop = $("#user-profile-posts-container").position().top;
        $("body").animate({scrollTop:distanceToTop+"px"}, 400);
    }
	
	$("#user-profile-container").on("click", "#show-user-likes", function(event){
		// event.preventDefault();
		// console.log("Show Posts liked by user");
		showPostsLikedByUser();
        scrollToProfilePostsContainer();
	});
	
	$("#user-profile-container").on("click", "#show-user-spring-show", function(event){
		// event.preventDefault();
		// console.log("Show Posts liked by user");
		showSpringShowPicksForUser();
        scrollToProfilePostsContainer();
	});
	
	
	// -------------------------------------------------------
	// nav bar buttons 
	// -------------------------------------------------------
	
	// Tapping title 
	$("#title>a").click(function(event){
		event.preventDefault();
		showAndRefreshPosts();
	});
	
	// Add new post 
	$("#new-post").click(function(event){
		event.preventDefault();
		showScreen("#comment-form-container");
	});
	
	// Profile button
	$("#profile").click(function(event){
		event.preventDefault();
		showProfile();
	});
	
	// refresh button 
	$("#refresh").click(function(event){
		event.preventDefault();
		showAndRefreshPosts();
	});
	
	$("#modal-dialog").click(function(event){
		event.stopPropagation();
	});
	
	// --------------------------------------------------
	// Initialize 
	// --------------------------------------------------
	showAndRefreshPosts();
	setLoginStatus();
});
// **********************************************************************************


// Add a post - This uploads the file
function addPost() {
	// Get the file to upload
	showLoading();
	var fileUploadElement = $("#input-file")[0];
	var filepath = $("#input-file").val();
	var filename = filepath.split('\\').pop()
			
	// Upload the file
	if (fileUploadElement.files.length > 0) {
		// If there's a file upload it then add a post
		var file = fileUploadElement.files[0];
		var parseFile = new Parse.File(filename, file);
		
		parseFile.save().then(function() {
			// console.log("ParseFile Success");
			saveComment(parseFile);
		}, function(error) {
			console.log("ParseFile Error:"+error.message);
			hideLoading();
		});
	} else {
		// Else if no file just upload a post
		saveComment(false);
	}
}

// Add Comment - After uploading file upload comment
function saveComment(file) {
	// Make a new Comment object - will generate a record in the Comment table
	var Comment = Parse.Object.extend("Comment");
	var comment = new Comment();
	
	// Get the text of the comment
	var text = $("#comment").val();
	
	// Set a value on the comment - will add a field to the Comment table
	comment.set("comment", text);
	// Set the current user as author of this comment
	comment.set("author", Parse.User.current());
	
	// check file 
	if (file) {
		comment.set("image", file);
	} else {
		comment.set("image", null);
	}
	
	// Save the new comment
	comment.save(null, {
		success: function(comment) {
			// console.log("New Comment added:"+comment.id);	// If successful post a message 
			// updateComments(); 	// Update the comment list
			showAndRefreshPosts(); 	// Show the posts container and refresh
			hideLoading();
		}, 	
		error: function(comment, error) {
			// Post a message if there's an error 
			console.log("Comment failed:"+error.message);
		}
	});

}

// **********************************************************************************
// This is not functioning, yet...
// Like post 

function like(postId) {
	var Like = Parse.Object.extend("Like");
	var like = new Like();
	var likeQuery = Parse.query = new Parse.Query(Like);
	likeQuery.equalTo("user", Parse.User.current());
	likeQuery.equalTo("commentId", postId);
	
	// TODO: *************** 
	
	likeQuery.find({
		success: function(likes) {
			// console.log("Search for Likes successful");
			if (likes.length > 0) {
				// console.log("Like found!", likes.length);
				for (var i in likes) {
					likes[i].destroy({
						success: function() { 
							// console.log("Like destroyed") ;
							// decrement comment.likes
							var Comment = Parse.Object.extend("Comment");
							var comment = new Comment({id:postId});
							comment.increment("likes", -1); // obj.decrement("field") doesn't work?
							comment.save({
								success: function() {
									// console.log(">>> decrement likes success");
								}, error: function(error) {
									console.log(">>> decrement likes error:"+error.message);
								}
							});
						},
						error: function() { 
							console.log("Like Destroy error"); 
						}
					});
				}
			} else {
				// console.log("no Like found, add one!");
				var Like = Parse.Object.extend("Like");
				var like = new Like();
				like.set("user", Parse.User.current());
				like.set("commentId", postId);					// Sets commentId as String???
				var Comment = Parse.Object.extend("Comment");	
				var comment = new Comment({id:postId})
				like.set("comment", comment); // set comment to pointer
				like.save(null, {
					success: function(like) {
						// console.log("Like success", like.id);
						// console.log("Like commentID:", like.get("commentId"));
						// console.log("Like user", like.get("user"));
						comment.increment("likes");
						comment.save();
					}, 
					error: function(like, error) {
						console.log("like error", error.message);
					}
				});
			}
		},
		error: function(like, error) {
			console.log("No Like found Error");
		}
	})
}


// **********************************************************************************

function addToMySpringshow(postId) {
	var Profile = Parse.Object.extend("Profile");
	var query = new Parse.Query(Profile);
	query.equalTo("user", Parse.User.current());
	query.find({
		success: function(results) {
			var profile = results[0];
			var mySpringShow = profile.get("mySpringShow");
			// Look through my spring show list for postId
			for (var i in mySpringShow) {
				if (mySpringShow[i].id == postId) { // PostId found in list
					// console.log("*** This item already exists in this list remove it"); 
					mySpringShow.splice(i, 1);
					// save
					profile.save({
						success: function(results){
							// console.log("**** profile saved new count "+results.get("mySpringShow").length);
							updateAddToSpringShowFor(postId);
						}, error: function(error) {
							console.log("**** profile saved after item removed from myspring show error:"+error.message);
						}
					}); 
					return
				}
			}
			
			// console.log("*** That postId is not in this list")
			// Check if there are less than 6 items
			if (mySpringShow.length < 6) {
				// console.log("*** less than 6 items in list can add a new one");
				// console.log("*** That id is not in this list add it");
				var Comment = Parse.Object.extend("Comment");
				mySpringShow.push(new Comment({id:postId}));
				profile.save({
					success: function(results) {
						// console.log("**** Saved profile added new spring show item :"+results.get("mySpringShow").length);
						updateRemoveFromSpringShowFor(postId);
					}, error: function(error) {
						console.log("**** Saving Profile error adding new item:"+error.message);
					}
				});
			} else {
				// console.log("*** There are 6 items in your spring show list already can't add anything new");
				showMessage("There are 6 items in your spring show list already can't add anything new");
			}
		}, error: function(error) {
			console.log("Add to springshow user profile find Error:"+error.message);	
		}
	});
}

// **********************************************************************************

// Display all records in the comment table 

function updateComments() {
	// Get user
	var user = Parse.User.current();
	
	// Make a new Comment Object - This represents the Comment table
	var Comment = Parse.Object.extend("Comment");
	
	// Query the comment table
	var query = new Parse.Query(Comment);
	query.include("author");
	
	// Order by date, most recent first
	query.descending("createdAt");
	
	// Limit the number of records returned to postsToLoadCount
	query.limit(postsToLoadCount);
	
	// Run the Query find all
	query.find({
		success: function(results) {
			// console.log("Comment Query success:"+results.length);
			var newList = "";
			var posts = "";
			// Loop through all of the results
			var output = "";
			for (var i = 0; i < results.length; i++) {
				output += getTemplateWith(results[i]);
			}
			
			output += "<li><a id='load-more' href=''>Load more</a></li>"
			$("#posts").html(output);
			getLikes();
			getSpringShowList();
		}
	});
}


/* 
	This function receives a Parse results object and 
	returns the template text populated with properties 
	from that post. 
*/

function getTemplateWith(post) {
	var tmpl_obj = {};
	tmpl_obj.id = post.id;
	tmpl_obj.username = post.get("author").get("username");
	tmpl_obj.comment = post.get("comment");
	tmpl_obj.likes = post.get("likes");
	tmpl_obj.hasthumb = "no-thumb";
	
	// console.log("Like count for post:"+tmpl_obj.likes);
	
	if (post.get("image")) {
		tmpl_obj.image = post.get("image").url();
		tmpl_obj.hasthumb = "has-thumb";
	} else {
		tmpl_obj.image = "";
	}
	
	if (post.get("thumbnail")) {
		tmpl_obj.thumbnail = post.get("thumbnail").url();
	} else {
		tmpl_obj.thumbnail = "";
	}
	
    // var dateArray = String(post.createdAt).split(" ");
    // var formattedDate = dateArray[0]+" "+dateArray[1]+" "+dateArray[2]+" "+dateArray[4];
    
    // formatDate(new Date(post.createdAt));
    
    var d = formatDate(String(post.createdAt)).split(" ");
    // console.log(d);
    var formattedDate = d[0]+" "+d[1]+" "+d[2]+" "+d[3]+" "+d[4]+" "+d[5];
    
	tmpl_obj.date = formattedDate; // +" "+post.createdAt;
    
    // Make HTML from the compiled template function and return that. 
	return postTemplate(tmpl_obj);
}

// **********************************************************************************

function getLikes() {
	var user = Parse.User.current();
	if (!user) {
		return;
	}

	var Like = Parse.Object.extend("Like");
	var likeQuery = new Parse.Query(Like);
	
	likeQuery.equalTo("user", user);
	likeQuery.find({
		success: function(likes) {
			for (var i in likes) {
				// console.log("Likes comment id:"+likes[i].get("commentId")+"like user:"+likes[i].get("user").id );	
				var id = likes[i].get("commentId");
				$("div[data-id='"+id+"']").find(".like-text").html("Unlike");
			}
		}, error: function() {
			console.log("Like Query Error:"+error.message);
		}
	});
}


// **********************************************************************************

function showPostsForUser() {
	var user = Parse.User.current();
	if (!user) {
		return;
	}
	var Comment = Parse.Object.extend("Comment");
	var query = new Parse.Query(Comment);
	query.descending("createdAt");
	query.equalTo("author", user);
	query.include("author"); // try include("author.username");
	
	query.find({
		success: function(results) {
			// console.log("Found posts for user");
			var output = "";
			for (var i in results) {
				output += getTemplateWith(results[i]);
			}
			$("#user-profile-posts").html(output);
			getLikes();
			getSpringShowList();
		}, error: function(error) {
			console.log("Error finding posts for user:"+error.message);
		}
	});
}

// ---------------------------------------------------------------------
// Show Posts liked by user 
// ---------------------------------------------------------------------

function showPostsLikedByUser() {
	var user = Parse.User.current();
	if (!user) {
		return;
	}
	var Like = Parse.Object.extend("Like");
	var query = new Parse.Query(Like);
	
	query.descending("createdAt");
	query.equalTo("user", user);
	query.include("comment");
	
	query.find({
		success: function(results) {
			// console.log("Found liked posts for user");
			var output = "";
			for (var i in results) {
				// TODO: Fix this template results object is not right
				output += getTemplateWith(results[i].get("comment"));
			}
			// TODO: Update Like and My Spring Show Buttons
			$("#user-profile-posts").html(output);
			getLikes();
			getSpringShowList();
		}, error: function(error) {
			console.log("Error finding liked posts for user:"+error.message);
		}
	});
}

// **********************************************************************************

// Get Spring show list for user

function getSpringShowList() {
	var user = Parse.User.current();
	if (!user) {
		return;
	}
	// Get the profile
	var Profile = Parse.Object.extend("Profile");
	var query = new Parse.Query(Profile);
	query.equalTo("user", user);
	query.find({
		success: function(results) {
			// Update the My Spring Show buttons
			// console.log("Success get spring show list from profile");
			updateSpringShowStatus(results[0].get("mySpringShow"));
		},
		error: function(error) {
			console.log("Get Spring Show list error:"+error.message);
		}
	});
}

// ***********************************************************************

function showSpringShowPicksForUser() {
	var user = Parse.User.current();
	if (!user) {
		return;
	}
	// console.log("Show Spring show picks by user");
	var Profile = Parse.Object.extend("Profile");
	var query = new Parse.Query(Profile);
	query.equalTo("user", user);
	query.include("mySpringShow");
	query.find({
		success: function(results) {
			// console.log("Spring Show for user results");
			// console.log(results);
			var mySpringShowArray = results[0].get("mySpringShow");
			var output = "";
			for(var i in mySpringShowArray) {
				output += getTemplateWith(mySpringShowArray[i]);
			}
			// TODO: Update Like and My Spring Show buttons
			$("#user-profile-posts").html(output);
			getLikes();
			getSpringShowList();
		}, error: function(error) {
			console.log("Spring show for user error:"+error.message);
		}
	});
}



// ***********************************************************************

// Update the status of the my spring show buttons 

function updateSpringShowStatus(mySpringShow) {
	// console.log("new spring show list:");
	// console.log(mySpringShow);
	for (var i in mySpringShow) {
		var id = mySpringShow[i].id;
		// console.log("Id: "+id+" is in spring show list mark it with remove...");
		updateRemoveFromSpringShowFor(id);
	}
}

function updateAddToSpringShowFor(id) {
	// console.log("Changing Status to add for "+id);
	$("div[data-id='"+id+"']").find(".my-springshow-button").html("Add to My Spring Show");
}

function updateRemoveFromSpringShowFor(id) {
	// console.log("Changing Status to remove for "+id);
	$("div[data-id='"+id+"']").find(".my-springshow-button").html("Remove from My spring show");
}

// **********************************************************************************

function signup(username, email, password, studentId, firstName, lastName) {
	// console.log("Sign up new User", username, email, password, studentId, firstName, lastName);
	var user = new Parse.User();
	user.set("username", username);
	user.set("password", password);
	user.set("email", email);
	// user.set("foo", "bar");
	// user.set("hello", "world");
	
	user.signUp(null, {
		success: function(user){
			// console.log("Sign up Success:");
			createUserProfile(user, studentId, firstName, lastName);
			setLoginStatus();
			showAndRefreshPosts();
		},
		error: function(user, error) {
			// console.log("Sign up error:"+error.message);
			showMessage("Could not sign in error:"+error.message);
		}
	});
	
}


function createUserProfile(user, studentId, firstName, lastName) {
	var Profile = Parse.Object.extend("Profile");
	var profile = new Profile();
	
	profile.set("user", user);
	profile.set("studentId", studentId);
	profile.set("firstName", firstName);
	profile.set("lastName", lastName);
	
	profile.set("mySpringShow", []);
	
	profile.save(null, {
		success: function(profile) {
			// console.log("Success New profile for "+user);
			showMessage("New user profile created");
		}, error: function(profile, error) {
			// console.log("Error new profile:"+error.message);
			showMessage("Could not create user profile error:"+error.message);
		}
	});
}



function login(username, password) {
	Parse.User.logIn(username, password, {
		success: function(user){
			// console.log("Login Success:"+user.username);
			setLoginStatus();
			showAndRefreshPosts();
			showMessage("Thanks for logging in");
		},
		error: function(user, error) {
			// console.log("login error:"+error.message);
			showMessage("Could not login Error:"+error.message);
		}
	});
}


function setLoginStatus() {
	if (Parse.User.current()) {
		$("body").addClass("loggedin");
	} else {
		$("body").removeClass("loggedin");
	}
}

function getUserProfileForCurrentUser() {
	// console.log("Get user profile for current user");
	var user = Parse.User.current();
	var Profile = Parse.Object.extend("Profile");
	var query = new Parse.Query(Profile);
	query.equalTo("user", user);
	query.find({
		success: function(results) {
			// console.log("Success get user profile for user");
			var profile = results[0];
			var output = "";
			var firstname = profile.get("firstName");
			var lastname = profile.get("lastName");
			var studentId = profile.get("studentId");
			var createdAt = profile.createdAt;
			var mySpringShow = profile.get("mySpringShow");
            
            // show spring show count
            $("#show-user-spring-show>.button-badge").html(mySpringShow.length);
			
			updateMySpringShow(mySpringShow);
			getPostCountForUser();
			getLikeCountForUser();
            
            console.log(">>>"+user.get("username"));
            $("#user-id").html(user.get("username"));
            
			// $(".user-name").html(user.username);
			// $(".firstname").html(firstname);
			// $(".lastname").html(lastname);
			
			// TODO: Format user profile info 
			// output += firstname+" "+lastname+" "+studentId+" "+createdAt+" "+mySpringShow
			// $("#user-profile-info-container").html(output);
			// $("#user-id").html(firstname+" "+lastname);
			
		}, error: function(error) {
			// console.log("Error get user profile for user:"+error.message);
			showMessage("Could not get user profile, error:"+error.message);
		}
	}).then(function(){
        var Like = Parse.Object.extend("Like");
        var query = new Parse.Query(Like);
        query.equalTo("user", Parse.User.current());
        query.count({
            success: function(count) {
                $(".like-total").html(count);
            }, error: function(error) {
                console.log("Profile Like Count error:"+error.message);
            }
        });
    }).then(function(){
        
    });
}

var mySpringShow = [];

function updateMySpringShow(array) {
	mySpringShow = array;
	// console.log("My Spring Show Count:"+mySpringShow.length);
}



function getPostCountForUser() {
	var user = Parse.User.current();
	var Comment = Parse.Object.extend("Comment");
	var query = new Parse.Query(Comment);
	query.include(["author.username"]);
	query.equalTo("author", user);
	query.count({
		success: function(count) {
			// console.log(user.username+" has "+count+" posts");
			$(".post-count").html(count);
            $("#show-user-posts>span").html(count);
		}, error: function(error) {
			console.log("user post count error:"+error.message);
		}
	});
}

function getLikeCountForUser() {
	var user = Parse.User.current();
	var Like = Parse.Object.extend("Like");
	var query = new Parse.Query(Like);
	query.equalTo("user", user);
	query.count({
		success: function(count) {
			// console.log("Like count for user:"+count);
			$(".like-count").html(count);
            $("#show-user-likes>span").html(count);
		}, error: function(error) {
			console.log("Error counting likes:"+error.message);
		}
	});
}



// *************************************************************************************

function showLoading() {
	$("#modal-dialog").removeClass("hide");
}

function hideLoading() {
	$("#modal-dialog").addClass("hide");
}


function showMessage(message) {
	$("#message-dialog .message").html(message);
	$("#message-dialog").removeClass("hide");
	setTimeout(function() {
		$("#message-dialog").addClass("hide");
	}, 3000);
}

// showMessage("This is a test message");

// showMessage("A temporary message");
    
function formatDate(date) {
    var d = new Date(date);
    var hh = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
        h = hh-12;
        dd = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    m = m<10?"0"+m:m;

    s = s<10?"0"+s:s;

    /* if you want 2 digit hours:
    h = h<10?"0"+h:h; */

    var pattern = new RegExp("0?"+hh+":"+m+":"+s);

    var replacement = h+":"+m;
    /* if you want to add seconds
    replacement += ":"+s;  */
    replacement += " "+dd;    

    return date.replace(pattern,replacement);
}
    
    
    
// ------
function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
}
    
setTimeout(function(){
    // toggleFullScreen();
}, 100);
    
window.scrollTo(0, 1);


