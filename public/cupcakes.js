var Cupcake = Backbone.Model.extend({

	validate: function(attributes) {
	    if (!attributes.icing) {
	      return "No icing";
	    }

	    if (!attributes.cake) {
	      return "No cake";
	    }

	    if (attributes.sprinkles != "true" && attributes.sprinkles != "false") {
	      return "Sprinkles isn't true or false";
	    }

 	}

})

var Shop = Backbone.Collection.extend({

	url: "/cupcakes",
  	model: Cupcake

})

var shop = new Shop();
var templates = {};
var currentlyEditedId;

var switchUI = function() {
  $(".allCupcakes").toggle()
  $(".specificCupcake").toggle()
}

var updateUI = function() {
  	$("#cupcakeList").html("");

  	shop.each(function(cupcake){

    	var htmlString = templates.cupcake(cupcake.toJSON());
    	var $itemHtml = $(htmlString);

    	$("#cupcakeList").append($itemHtml);

    	$itemHtml.find(".delete-button").on("click", function(){

     	var id = $(this).attr("data-id")

      	shop.get(id).destroy({
        complete: updateUI
      	});

    	});

	    $itemHtml.find(".edit-button").on("click", function(){

	      switchUI();

	      var id = $(this).attr("data-id")
	      var cake = shop.get(id)

	      $("#edit-title").val(cake.get("title"))
	      $("#edit-abv").val(cake.get("abv"))
	      currentlyEditedId = id

	    });
  	});
}

$("#create").on("click", function(){
  var icing = $("#icingInput").val();
  var cake = $("#cakeInput").val();
  var sprinkles = $("#sprinklesInput").val();

  var cupcake = new Cupcake({
    icing: icing,
    cake: cake,
    sprinkles: sprinkles
  });

  if (cupcake.isValid() === true) {
    shop.add(cupcake);

    cupcake.save({}, {
      complete: updateUI
    });
    
    $("#icingInput").val("");
    $("#cakeInput").val("");
    $("#sprinklesInput").val("");
  }
  else {
    alert(cupcake.validationError);
  }

});

$("#cancel-button").on("click", switchUI);

$("#edit-button").on("click", function(){
  var icing = $("#editIcing").val();
  var cake = $("#editCake").val();
  var sprinkles = $("#editSprinkles").val();

  var cupcake = shop.get(currentlyEditedId);

  cupcake.set("icing", icing);
  cupcake.set("cake", cake);
  cupcake.set("sprinkles", sprinkles);

  if (cupcake.isValid()) {
    cupcake.save({}, {
      complete: function(){
        updateUI()
        switchUI()
      }
    })
  }
  else {
    alert(cupcake.validationError)
  }
})

$("#search").on("click", function(){
  	var flavorID = $("#searchInput").val();
  	console.log(flavorID);
 	var flavor = shop.get(flavorID);
 	console.log(flavor);
 	$("#cupcakeList").html("");

 	var htmlString = templates.cupcake(flavor.toJSON());
    	var $itemHtml = $(htmlString);

    	$("#cupcakeList").append($itemHtml);
});

$("#all").on("click", function(){
	updateUI();
});




$(document).on("ready", function(){

  templates.cupcake = Handlebars.compile($("#cupcake-template").text());

  shop.fetch({
    success: function() {
      updateUI()
    }
  })

});

	

