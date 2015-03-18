/*
			// Look for this post id in the list and check count
			if (mySpringShow.indexOf(postId) == -1 && mySpringShow.length <= 5) { 
				// Item does not exist and there are 5 or less items, add the item to the list
				console.log("New item added to your springshow list");
				var Comment = Parse.Object.extend("Comment");
				mySpringShow.push(new Comment({id:postId})); // postId); // And a post object
				results[0].set("mySpringShow", mySpringShow); // Parse.Object.extend()
				results[0].save({
					success: function(results) {
						console.log("success: added to my springshow count:"+results.get("mySpringShow").length);
						updateRemoveFromSpringShowFor(postId);
					},
					error: function(results, error) {
						console.log("Error added to my springshow: "+error.message);
					}
				});
			} else if (mySpringShow.indexOf(postId) == -1 && mySpringShow.length >= 5) {
				// Item does not exist and there are 5 items in the list, do nothing
				console.log("You have 5 springshow items in your list count:"+results[0].get("mySpringShow").length);
				
			} else if (mySpringShow.indexOf(postId) != -1) {
				// Item exists in the list, remove item
				console.log("This item removed from your spring show list");
				mySpringShow.splice(mySpringShow.indexOf(postId), 1);
				results[0].set("mySpringShow", mySpringShow);
				results[0].save({
					success: function(results) {
						console.log("success: Item removed from springshow list count:"+results.get("mySpringShow").length);
						updateAddToSpringShowFor(postId);
					},
					error: function(results, error) {
						console.log("Error removing item from spring show: "+error.message);
					}
				});
			}*/