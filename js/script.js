$(document).ready(function () {
    // set the previous data array to what is stored  in local storage if local storage empty then variable will be null
    let previous = JSON.parse(localStorage.getItem('previous_data'));
    // clearing local storage
    localStorage.removeItem("previous_data");

    // initilize the datepicker and format the y-m-d and set max date to today so no future dates can be selected
    $("#datepicker").datepicker({ maxDate: '0', dateFormat: "yy-mm-dd" });

    // hide elements on page
    $("#current_search").hide();
    $("#liked_content_div").hide();

    /////////////////////////////
    //////  Functions  //////
    /////////////////////////////

    // function used to check if data is json or not
    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    // update page function, this will clear the page and rebuild the page with new data
    function update_page() {
        // if previous is null, undefined or array length of zero then terminate function
        if (previous === undefined || previous === null || previous.length == 0) {
            return;
        }
        // empty both recent searches and favorites content
        $("#recent_searches").empty();
        $("#favs").empty();


        previous.forEach((element, index) => {
            let dataset = JSON.parse(element);
            let html = "";
            let favs = "";

            if (dataset["fav"]) {
                // build list for the fav items
                favs = favs + ` <h4>` + dataset["title"] + `</h4>
                            <h6><i class="fa-solid fa-calendar-days"></i> <span>`+ dataset['date'] + ` </span> <span class="float-right"> <div class="like" data-id="` + index + `"> <i class="fa-solid fa-heart-circle-minus"></i> </div> </span></b></h6>
                            <h7>`+ dataset["explanation"] + `</h7>
                            <div class="text-center">
                            <a id="hdurl" href="">
                            `;

                if (dataset["url"].toLowerCase().match(/\.(jpg|png|gif|jpeg)/g)) {
                    favs = favs + `<img src="` + dataset["url"] + `" class="img-fluid">`;
                } else {
                    favs = favs + `<div class="embed-responsive embed-responsive-16by9">
                                <iframe class="embed-responsive-item" src="`+ dataset["url"] + `" allowfullscreen></iframe>
                            </div>`;
                }
                favs = favs + `</a></div>`;

            }
            // build list for recent searches the page
            html = html + ` <h4>` + dataset["title"] + `</h4>
                        <h6><i class="fa-solid fa-calendar-days"></i> <span>`+ dataset['date'] + ` </span> <span class="float-right">
                        `;
            if (dataset["fav"]) {
                html = html + `<div class="like" data-id="` + index + `"> <i class="fa-solid fa-heart-circle-minus"></i> </div> `;
            } else {
                html = html + `<div class="like" data-id="` + index + `"> <i class="fa-solid fa-heart-circle-plus pink"></i> </div> `;
            }


            html = html + `  </span></b></h6>
                        <h7>`+ dataset["explanation"] + `</h7>
                        <div class="imgNasa">
                        <a id="hdurl" href="">
                        `;

            if (dataset["url"].toLowerCase().match(/\.(jpg|png|gif|jpeg)/g)) {
                html = html + `<img src="` + dataset["url"] + `" class="img-fluid">`;
            } else {
                html = html + `<div class="embed-responsive embed-responsive-16by9">
                            <iframe class="embed-responsive-item" src="`+ dataset["url"] + `" allowfullscreen></iframe>
                        </div>`;
            }
            html = html + `</a></div>`;



            $("#recent_searches").append(html);
            $("#favs").append(favs);

        });


    }



    // check if the searched date exists in the array
    function check_exists(date) {
        let found = false;
        if (previous != null) {
            previous.forEach(element => {
                let dataset = JSON.parse(element);

                if (dataset["date"] == date) {

                    found = true;
                }

            });
        } else {
            return found;
        }

        return found;
    }





    ////////////////////////////////////////
    ///////  EVENTS  ///////
    ////////////////////////////////////////

    // trigger page update on page load
    update_page();

    // search button click event
    $("#search").click(function () {
        // variable for user search date
        let search_date;
        //reset the css class for if the user has already clicked like as this element is reloaded
        $("#update_like_class").removeClass("fa-solid fa-heart-circle-minus");
        $("#update_like_class").addClass("fa-solid fa-heart-circle-plus pink");

        // check if the user submitted a date, if no date set to todays date
        if (!$('#datepicker').val()) {
            let date = new Date();
            // no datepicker value so get current date
            search_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        } else {
            //set search date variable to datepicker value
            search_date = $('#datepicker').val();
        }

        // result for if the date exists in dataset or not
        let does_query_exist = check_exists(search_date)


        // pull from local array
        if (does_query_exist) {

            previous.forEach((element, index) => {
                let data_array = JSON.parse(element);
                // if current element in the array's date field matches the search date then build content
                if (data_array["date"] == search_date) {
                    //update the title
                    $("#current_search_title").text(data_array["title"]);
                    //update the desc
                    $("#current_search_text").text(data_array["explanation"]);
                    // update the date
                    $("#current_search_date").text(data_array["date"]);

                    if (data_array["url"].toLowerCase().match(/\.(jpg|png|gif|jpeg)/g)) {
                        //unhide if its been hidden before
                        $("#current_search_image").show();

                        //hide the video element because this is an image
                        $("#current_search_video").hide();

                        //set video source to nothing
                        $("#current_search_video_link").attr("src", "");


                        //update the image and set it to nothing so previous image unloads
                        $("#current_search_image").attr("src", "");
                        //update the image
                        $("#current_search_image").attr("src", data_array["url"]);
                        // clear the url before updating
                        $("#hdurl").attr("href", "");
                        // update hd url 
                        $("#hdurl").attr("href", data_array["hdurl"]);

                    } else {
                        //hide image element
                        $("#current_search_image").hide();
                        //show video element
                        $("#current_search_video").show();

                        //set hd url to null because its not used on video
                        $("#hdurl").attr("href", "");

                        //update the video url
                        $("#current_search_video_link").attr("src", data_array["url"]);



                    }

                    //set fav id
                    $("#current_like").attr("data-id", index);

                    // if the item is fav then set css class accordingly
                    if (data_array["fav"]) {
                        $("#update_like_class").removeClass("fa-solid fa-heart-circle-plus pink");
                        $("#update_like_class").addClass("fa-solid fa-heart-circle-minus");
                    } else {
                        $("#update_like_class").removeClass("fa-solid fa-heart-circle-minus");
                        $("#update_like_class").addClass("fa-solid fa-heart-circle-plus pink");
                    }

                    //show the current search content
                    $("#current_search").slideDown();


                    return;
                }


            });

        } else {
            // async query to nasa and grab json object and return response
            async function Fetch_Nasa_Data() {

                let url = new URL('http://api.nasa.gov/planetary/apod/');
                // additional parameters for the request 
                let params = { 'api_key': '6ykG7u1eUPpgLtwI4XInsq7ZK9dKtGKOR8wcisEo', 'date': search_date };
                // attach parameters to url
                url.search = new URLSearchParams(params);

                let result = await fetch(url);
                if (result.ok && result.status == 200) {

                    let text = await result.text();

                    return text;
                } else {
                    return `HTTP error: ${result.status}`;
                }
            }

            Fetch_Nasa_Data().then(data => {

                //if the data is json, then there is no issue. convert json to array and output data to page
                // if data is not json then append to page with error page does not exist
                if (isJson(data)) {
                    // convert json to array
                    let data_array = JSON.parse(data);
                    //add a fav option to the array, later the array will be stored and update fav data.
                    data_array["fav"] = false;

                    //update the title
                    $("#current_search_title").text(data_array["title"]);
                    //update the desc
                    $("#current_search_text").text(data_array["explanation"]);
                    // update the date
                    $("#current_search_date").text(data_array["date"]);
                    // check if its an image if not then its video
                    if (data_array["url"].toLowerCase().match(/\.(jpg|png|gif|jpeg)/g)) {
                        //unhide if its already been hidden before
                        $("#current_search_image").show();

                        //hide the video element
                        $("#current_search_video").hide();

                        //also set video source to nothing
                        $("#current_search_video_link").attr("src", "");


                        //update the image and set it to nothing so previous image unloads
                        $("#current_search_image").attr("src", "");
                        //update the image
                        $("#current_search_image").attr("src", data_array["url"]);
                        // clear the url before updating
                        $("#hdurl").attr("href", "");
                        // update hd url 
                        $("#hdurl").attr("href", data_array["hdurl"]);

                    } else {
                        //hide image element
                        $("#current_search_image").hide();
                        //show video element
                        $("#current_search_video").show();

                        $("#current_search_video_link").attr("src", data_array["url"]);



                    }




                    if (previous) {
                        // update the previous array
                        previous.push(JSON.stringify(data_array));
                        // store the array as json in localstorage
                        localStorage.setItem("previous_data", JSON.stringify(previous));


                    } else {
                        // because previous doesnt have a data structure make a temp array and push the array to the array called previous
                        let temp_array = [];
                        temp_array.push(JSON.stringify(data_array));
                        previous = temp_array;

                        // store the array as json in localstorage
                        localStorage.setItem("previous_data", JSON.stringify(previous));

                    }

                    // setup the current like button set the id to the last array index
                    fav_id = previous.length - 1;
                    $("#current_like").attr("data-id", fav_id);


                    //show the content
                    $("#current_search").slideDown();







                } else {
                    // append the error to the page so the user can see there is an error
                    $("#search_error").html(data);
                }



            });

        }
        // trigger page update
        update_page();
    });

    //button to dismiss the current search result
    $("#close_search").click(function () {
        $("#current_search").slideUp();

    });

    //liked content & recent content toggle display
    $("#liked_content").click(function () {
        $(this).toggleClass('toggled');

        if ($(this).hasClass('toggled')) {
            $("#recent_searches_div").slideUp("slow", function () {
                $("#liked_content_div").delay(500).show("slide", { direction: "left" }, 1000);
                $("#liked_content").text("Recent Content");
            });

        } else {
            $("#liked_content_div").slideUp("slow", function () {
                $("#recent_searches_div").delay(500).show("slide", { direction: "right" }, 1000);
                $("#liked_content").text("Liked Content");
            }

            );
        }

    });
    // like button functionality
    $('body').on('click', '.like', function () {
        let clicked_id = $(this).attr("data-id");

        previous.forEach(function (item, index, array) {

            let dataset = JSON.parse(item);

            if (index == clicked_id) {

                dataset["fav"] = !dataset["fav"];

                if ($("#current_like").attr("data-id") == index) {
                    if (dataset["fav"]) {
                        $("#update_like_class").removeClass("fa-solid fa-heart-circle-plus pink");
                        $("#update_like_class").addClass("fa-solid fa-heart-circle-minus");
                    } else {
                        $("#update_like_class").removeClass("fa-solid fa-heart-circle-minus");
                        $("#update_like_class").addClass("fa-solid fa-heart-circle-plus pink");
                    }

                }

                array[index] = JSON.stringify(dataset);
                localStorage.setItem("previous_data", JSON.stringify(array));
                update_page();
            }

        });


    });






});