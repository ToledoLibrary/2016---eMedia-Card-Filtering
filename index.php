<html>
<head>

    <title>eMedia - eBooks, eAudiobooks, Music, Movies, eMagazines, Comics</title>
    <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="UTF-8">

    <link rel='shortcut icon' href='http://www.toledolibrary.org/favicon.ico' type='image/x-icon'/ >

    <link href="http://www.toledolibrary.org/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="http://www.toledolibrary.org/css/main.css" rel="stylesheet">
    <link href="http://www.toledolibrary.org/webfonts/ss-social-circle.css" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->


    <style type="text/css">
        .img-responsive {
            vertical-align: middle;
            cursor: pointer;
            max-width: 100%;
            height: auto;
        }

        .padding-lg {
            padding: 1vw 9vw !important;
        }

        .select2-dropdown {
            margin:3px !important;
        }

        .select2-selection {
            border:none !important;
        }

        .select2-container {
            margin-top: -6px !important;
        }

        nav.card-filters2 {
            margin-top: 2vw;
            text-align: center
        }
        .search-result-filters nav a.btn,
        nav.card-filters2 a.btn {
            background: #ffbc3d;
            color: #1d1d1d;
            display: inline-block;
            margin: 0 6px 6px 0
        }
        .search-result-filters nav a.btn.active,
        nav.card-filters2 a.btn.active {
            background: #cd202c;
            color: white
        }
        .search-result-filters nav a.btn.active:hover,
        nav.card-filters2 a.btn.active:hover {
            background: #b71d27
        }
        .search-result-filters nav a.btn:hover,
        nav.card-filters2 a.btn:hover {
            background: #ffaa0a
        }

        .flright {
            float:right;
            margin: 0 0.3em;
        }

        .textleft {
            text-align:left !important;
            margin: 0 0.3em;
        }

        .paddingtop10 {
            padding-top:10px;
        }

        .pad5f {
            padding:0 5px 0 0;
        }

        .pad5 {
            padding:0 2.5px;
        }

        .pad5l {
            padding:0 0 0 5px;
        }

        hr {
            background-color:#ffbc3d !important;
            display: block;
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            margin-left: auto;
            margin-right: auto;
            border-style: inset;
            border-width: 1px;
        }

        .card-filters .btn {
            padding: .73rem 1.4rem !important;
        }

        .mobile .btn {
            padding: .5rem .75rem !important;
        }





    </style>

    <!--
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    -->

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>

    <script type="text/javascript">

        $( document ).ready(function() {
            $('select').select2();

            $.get( "http://www.toledolibrary.org/landing-pages/blank-page", function( data ) {


                values=data.split('</header>');
                //alert(values[0]);
                document.getElementById("webheader").innerHTML = values[0];

                values2=values[1].split('<div class="row footer padding-lg">');
                //alert(values2[0]);

                //alert(values2[1]);
                document.getElementById("webfooter").innerHTML = values2[1];

            });

            // external js: isotope.pkgd.js

// init Isotope
            var d = $(".filtered-cards").isotope({
                //layoutMode: "masonry",
                itemSelector: ".filtered-card"
            });
// store filter for each group
            var filters = {};

            $('.filters').on( 'click', '.card-filters a', function() {
                var $this = $(this);

                var $buttonGroup = $this.parents('.card-filters');
                var filterGroup = $buttonGroup.attr('data-filter-group');

                filters[ filterGroup ] = $this.attr('data-filter');

                var filterValue = concatValues( filters );
                console.log(filters);
                d.isotope({ filter: filterValue });
                console.log(filterValue);
                // ANDY
                if (filterGroup == "device") {
                    var filterValue2 = filterValue;
                    var filterValue2 = filterValue2.replace(/\-/g, " ");
                    var filterValue2 = filterValue2.replace("*", "");
                    var filterValue2 = filterValue2.replace(".", "");
                    var filterValue2 = filterValue2.replace("ebooks", "");
                    var filterValue2 = filterValue2.replace("eaudiobooks", "");
                    var filterValue2 = filterValue2.replace("music", "");
                    var filterValue2 = filterValue2.replace("movies", "");
                    var filterValue2 = filterValue2.replace("emagazines", "");
                    var filterValue2 = filterValue2.replace(".", "");

                    if (filterValue2 == "") {
                        filterValue2 = "All Devices";
                        $(".device-filter").addClass("active");
                    }

                    $("#device-label").html("<i class=\"fa fa-check\"></i>  " + filterValue2);
                    $("#device-labelm").html("<i class=\"fa fa-check\"></i>  " + filterValue2);

                }
                //END

            });

            $('.card-filters').each( function( i, buttonGroup ) {
                var $buttonGroup = $( buttonGroup );
                $buttonGroup.on( 'click', 'a', function() {
                    $buttonGroup.find('.active').removeClass('active');
                    $( this ).addClass('active');
                });
            });

            // flatten object by concatting values
            function concatValues( obj ) {
                var value = '';
                for ( var prop in obj ) {
                    value += obj[ prop ];
                }
                return value;
            }

            $('nav.device-nav').hide();

            $('.device-filter').on( 'click', function() {
                $("nav.device-nav").toggle();

                var devicefiltertext = document.getElementById("device-label").innerHTML;
                var devicefiltertextm = document.getElementById("device-labelm").innerHTML;
                //console.log(devicefiltertext);
                //console.log(devicefiltertextm);
                if (devicefiltertext == "<i class=\"fa fa-toggle-off\"></i>&nbsp;&nbsp;Choose your Device" || devicefiltertext == "<i class=\"fa fa-toggle-off fa-toggle-on\"></i>&nbsp;&nbsp;Choose your Device") {
                   // $(".device-toggle a .device-label").toggleClass("active");
                    $("#device-label i").toggleClass("fa-toggle-on");
                    //console.log(devicefiltertext);
                }

                if (devicefiltertextm == "<i class=\"fa fa-toggle-off\"></i>&nbsp;&nbsp;Choose your Device" || devicefiltertextm == "<i class=\"fa fa-toggle-off fa-toggle-on\"></i>&nbsp;&nbsp;Choose your Device") {
                    // $(".device-toggle a .device-label").toggleClass("active");
                    $("#device-labelm i").toggleClass("fa-toggle-on");
                    //console.log(devicefiltertextm);
                }

                $(".device-toggle a .device-label").toggleClass("active");
                $(".device-toggle a .device-labelm").toggleClass("active");
            });

            $('.device-nav a').on( 'click', function() {
                $("nav.device-nav").hide();
                //$(".device-toggle a").addClass("active");
                $(".device-filter").addClass("active");
                //$(".device-filter i").toggleClass("fa-toggle-on");
            });


            $(".clear-filter").click(function(){
                //$(".filtered-cards").isotope({
                //    filter: '**'
                //});
                d.isotope({ filter: '**' });
                filters = {};
                //d.isotope({ filter: '*.*' });
                $("#device-label").html("<i class=\"fa fa-toggle-off\"></i>&nbsp;&nbsp;Choose your Device");
                $("#device-labelm").html("<i class=\"fa fa-toggle-off\"></i>&nbsp;&nbsp;Choose your Device");
                $("nav.device-nav").hide();
                //$(".device-toggle a").removeClass("active");
                $(".device-filter").removeClass("active");
                $(".device-nav a").removeClass("active");
                $(".format a").removeClass("active");
                $(".all").addClass("active");
                //$(".clear-filter").removeClass('active');
            });

        });

    </script>

    <script src="main.js"></script>

</head>
<body>
<div name=webheader[]" id="webheader"></div>
</header>

<section class="content-block research-tools-grid-block" id="emedia">
    <div class="row library-navy padding-sm extra-extra-horizontal-padding">
        <nav class="card-filters2 textleft device-toggle hidden-xs-down">
            <a id="device-label" class="btn device-filter" data-filter="*"><i class="fa fa-toggle-off"></i>&nbsp;&nbsp;Choose your Device</a>
            <a id="clear-label" class="btn clear-filter flright" data-filter="">Clear All</a>
        </nav>
        <nav class="card-filters2 textleft device-toggle hidden-sm-up">
            <a id="device-labelm" class="btn device-filter" data-filter="*"><i class="fa fa-toggle-off"></i>&nbsp;&nbsp;Choose your Device</a>
            <br/>
            <a id="clear-labelm" class="btn clear-filter" data-filter="">Clear All</a>
        </nav>
        <div class="filters">
            <nav class="card-filters device-nav textleft hidden-xs-down" data-filter-group="device">
                <a class="btn active all" data-filter="*"><i class="fa fa-th"></i>&nbsp;&nbsp;All Devices</a>
                <a class="btn" data-filter=".android-phone-or-tablet">Android Phone / Tablet</a>
                <a class="btn" data-filter=".chromebook">Chromebook</a>
                <a class="btn" data-filter=".iphone-or-ipad">iPhone / iPad</a>
                <a class="btn" data-filter=".ipod">iPod</a>
                <!--
                <a class="btn" data-filter=".ipod-classic">iPod Classic</a>
                <a class="btn" data-filter=".ipod-mini">iPod Mini</a>
                <a class="btn" data-filter=".ipod-shuffle">iPod Shuffle</a>
                -->
                <a class="btn" data-filter=".ipod-touch">iPod Touch</a>
                <a class="btn" data-filter=".kindle-ereader">Kindle e-Reader</a>
                <a class="btn" data-filter=".kindle-fire">Kindle Fire</a>
                <a class="btn" data-filter=".kindle-fire-hd">Kindle Fire HD</a>
                <a class="btn" data-filter=".mac">Mac</a>
                <a class="btn" data-filter=".nook-first">Nook 1st Edition</a>
                <a class="btn" data-filter=".nook-hd">Nook HD</a>
                <a class="btn" data-filter=".nook-simple">Nook Simple Touch</a>
                <a class="btn" data-filter=".nook-tablet">Nook Tablet</a>
                <a class="btn" data-filter=".pc">PC</a>
            </nav>
            <nav class="card-filters mobile device-nav textleft hidden-sm-up" data-filter-group="device">
                <a class="btn devices-btn-mobile active all" data-filter="*"><i class="fa fa-th"></i>&nbsp;&nbsp;All Devices</a>
                <a class="btn devices-btn-mobile" data-filter=".android-phone-or-tablet">Android Phone / Tablet</a>
                <a class="btn devices-btn-mobile" data-filter=".chromebook">Chromebook</a>
                <a class="btn devices-btn-mobile" data-filter=".iphone-or-ipad">iPhone / iPad</a>
                <a class="btn devices-btn-mobile" data-filter=".ipod">iPod</a>
                <a class="btn devices-btn-mobile" data-filter=".ipod-classic">iPod Classic</a>
                <a class="btn devices-btn-mobile" data-filter=".ipod-mini">iPod Mini</a>
                <a class="btn devices-btn-mobile" data-filter=".ipod-shuffle">iPod Shuffle</a>
                <a class="btn devices-btn-mobile" data-filter=".ipod-touch">iPod Touch</a>
                <a class="btn devices-btn-mobile" data-filter=".kindle-ereader">Kindle e-Reader</a>
                <a class="btn devices-btn-mobile" data-filter=".kindle-fire">Kindle Fire</a>
                <a class="btn devices-btn-mobile" data-filter=".kindle-fire-hd">Kindle Fire HD</a>
                <a class="btn devices-btn-mobile" data-filter=".mac">Mac</a>
                <a class="btn devices-btn-mobile" data-filter=".nook-first">Nook 1st Edition</a>
                <a class="btn devices-btn-mobile" data-filter=".nook-hd">Nook HD</a>
                <a class="btn devices-btn-mobile" data-filter=".nook-simple">Nook Simple Touch</a>
                <a class="btn devices-btn-mobile" data-filter=".nook-tablet">Nook Tablet</a>
                <a class="btn devices-btn-mobile" data-filter=".pc">PC</a>
            </nav>
            <hr>
            <nav class="card-filters format textleft hidden-xs-down" data-filter-group="format">
                <a class="btn active all" data-filter="*"><i class="fa fa-th"></i>&nbsp;&nbsp;All Formats</a>
                <a class="btn" data-filter=".ebooks"><i class="fa fa-tablet"></i>&nbsp;&nbsp;eBooks</a>
                <a class="btn" data-filter=".eaudiobooks"><i class="fa fa-headphones"></i>&nbsp;&nbsp;eAudiobooks</a>
                <a class="btn" data-filter=".music"><i class="fa fa-music"></i>&nbsp;&nbsp;Music</a>
                <a class="btn" data-filter=".movies"><i class="fa fa-television"></i>&nbsp;&nbsp;Movies</a>
                <a class="btn" data-filter=".emagazines"><i class="fa fa-columns"></i>&nbsp;&nbsp;eMagazines</a>
            </nav>
            <nav class="card-filters mobile format textleft hidden-sm-up" data-filter-group="format">
                <a class="btn active all" data-filter="*"><i class="fa fa-th"></i><br/>All Formats</a>
                <a class="btn" data-filter=".ebooks"><i class="fa fa-tablet"></i><br/>eBooks</a>
                <a class="btn" data-filter=".eaudiobooks"><i class="fa fa-headphones"></i><br/>eAudiobooks</a>
                <a class="btn" data-filter=".music"><i class="fa fa-music"></i><br/>Music</a>
                <a class="btn" data-filter=".movies"><i class="fa fa-television"></i><br/>Movies</a>
                <a class="btn" data-filter=".emagazines"><i class="fa fa-columns"></i><br/>eMagazines</a>
            </nav>
        </div>
        <div class="filtered-cards">
        <div class="search-result filtered-card col-xs-24 col-sm-24 col-lg-12 ebooks eaudiobooks movies iphone-or-ipad iphone ipod-touch kindle-fire kindle-fire-hd pc mac android-phone-or-tablet chromebook">
                <div class="card tool-card">
                    <h3>Overdrive
                        <i class="fa flright fa-tablet"></i>
                        <i class="fa flright fa-headphones"></i>
                        <i class="fa flright fa-television"></i>
                    </h3>
                    <div class="card-details">
                        <p> <strong>Formats:</strong> eBooks, eAudiobooks, Movies
                                <br/>
                            <strong>Features:</strong> Largest selection of content
                                <br/>
                            <small>Limit of 20 checkouts at a time</small>
                        </p>
                            <a href="https://toledo.overdrive.com/library/kids">Access just for Kids</a>
                            <br/>
                            <a href="https://toledo.overdrive.com/library/teens">Access just for Teens</a>
                        </p>
                        <div class="col-lg-24">
                            <a class="btn btn-cardinal" href="https://toledo.overdrive.com/">Access Overdrive</a>
                        </div>
                        <div class="col-lg-24 col-sm-24 paddingtop10 hidden-xs-down">
                            <a class="col-lg-8 col-sm-8" href='https://goo.gl/6tyS76'> <img class='img-responsive pad5f' src='https://s3.amazonaws.com/toledolibrary/uploads/images/AppStore.jpg' /> </a>
                            <a class="col-lg-8 col-sm-8" href='https://goo.gl/XLu9vF'><img class='img-responsive pad5' src='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg' /> </a>
                            <a class="col-lg-8 col-sm-8" href='https://goo.gl/9SEdtT'><img class='img-responsive pad5l' src='https://s3.amazonaws.com/toledolibrary/uploads/images/windows-store-badge.png' /> </a>
                        </div>
                        <div class="col-xs-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://goo.gl/6tyS76'> <img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/AppStore.jpg' /> </a>
                        </div>
                        <div class="col-xs-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://goo.gl/XLu9vF'><img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg' /> </a>
                        </div>
                        <div class="col-xs-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://goo.gl/9SEdtT'><img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/windows-store-badge.png' /> </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search-result filtered-card col-xs-24 col-sm-24 col-lg-12 ebooks eaudiobooks music movies iphone-or-ipad iphone ipod-touch kindle-fire-hd pc mac android-phone-or-tablet chromebook">
                <div class="card tool-card">
                    <h3>hoopla
                        <i class="fa flright fa-tablet"></i>
                        <i class="fa flright fa-headphones"></i>
                        <i class="fa flright fa-music"></i>
                        <i class="fa flright fa-television"></i>
                    </h3>
                    <div class="card-details">
                        <p> <strong>Formats:</strong> eBooks, <i>Comic Books</i>, eAudiobooks, Music, Movies
                                <br/>
                            <strong>Features:</strong> Everything is available instantly, no waiting
                                <br/>
                            <small>Limit of 6 checkouts per month</small>
                        </p>
                        <div class="col-lg-24">
                            <a class="btn btn-cardinal" href="https://www.hoopladigital.com/">Access hoopla</a>
                        </div>
                        <div class="col-lg-24 col-sm-24 paddingtop10 hidden-xs-down">
                            <a class="col-lg-8 col-sm-8" href='https://itunes.apple.com/us/app/hoopla-digital/id580643740?mt=8&uo=4'> <img class='img-responsive pad5f' src='https://s3.amazonaws.com/toledolibrary/uploads/images/AppStore.jpg' /> </a>
                            <a class="col-lg-8 col-sm-8" href='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg'><img class='img-responsive pad5' src='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg' /> </a>
                            <a class="col-lg-8 col-sm-8" href='https://s3.amazonaws.com/toledolibrary/uploads/images/amazon-badge.png'><img class='img-responsive pad5l' src='https://s3.amazonaws.com/toledolibrary/uploads/images/amazon-badge.png' /> </a>
                        </div>
                        <div class="col-xs-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://itunes.apple.com/us/app/hoopla-digital/id580643740?mt=8&uo=4'> <img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/AppStore.jpg' /> </a>
                        </div>
                        <div class="col-xs-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg'><img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg' /> </a>
                        </div>
                        <div class="col-xs-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://s3.amazonaws.com/toledolibrary/uploads/images/amazon-badge.png'><img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/amazon-badge.png' /> </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search-result filtered-card col-xs-24 col-sm-24 col-lg-12 emagazines iphone-or-ipad iphone ipod-touch pc mac android-phone-or-tablet chromebook">
                <div class="card tool-card">
                    <h3>Flipster
                        <i class="fa flright fa-columns"></i>
                    </h3>
                    <div class="card-details">
                        <p> <strong>Formats:</strong> eMagazines
                            <br/>
                            <strong>Features:</strong> Instantly available, no waiting
                        </p>
                        <div class="col-lg-24">
                            <a class="btn btn-cardinal" href="http://api.toledolibrary.org/db_referrer2.asp?code=flips">Access Flipster</a>
                        </div>
                        <div class="col-lg-24 col-sm-24 paddingtop10 hidden-xs-down">
                            <a class="col-lg-8 col-sm-8" href='https://itunes.apple.com/us/app/flipster-digital-magazines/id797106282?mt=8'> <img class='img-responsive pad5f' src='https://s3.amazonaws.com/toledolibrary/uploads/images/AppStore.jpg' /> </a>
                            <a class="col-lg-8 col-sm-8" href='https://play.google.com/store/apps/details?id=com.eis.mae.flipster.readerapp&hl=en'><img class='img-responsive pad5l' src='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg' /> </a>
                        </div>
                        <div class="col-xs-24 col-sm-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://itunes.apple.com/us/app/flipster-digital-magazines/id797106282?mt=8'> <img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/AppStore.jpg' /> </a>
                        </div>
                        <div class="col-xs-24 col-sm-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://play.google.com/store/apps/details?id=com.eis.mae.flipster.readerapp&hl=en'><img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg' /> </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search-result filtered-card col-xs-24 col-sm-24 col-lg-12 eaudiobooks iphone-or-ipad iphone ipod-touch kindle-fire kindle-fire-hd pc mac android-phone-or-tablet chromebook">
                <div class="card tool-card">
                    <h3 class="hidden-xs-down">RBdigital/audiobooks
                        <i class="fa flright fa-headphones"></i>
                    </h3>
                    <h3 class="hidden-sm-up">RB/audiobooks
                        <i class="fa flright fa-headphones"></i>
                    </h3>
                    <div class="card-details">
                        <p> <strong>Formats:</strong> eAudiobooks
                            <br/>
                            <strong>Features:</strong> Exclusive Recorded Books eAudiobooks
                        </p>
                        <div class="col-lg-24">
                            <a class="btn btn-cardinal" href="http://toledolucascooh.oneclickdigital.com/">Access RBdigital</a>
                        </div>
                        <div class="col-lg-24 col-sm-24 paddingtop10 hidden-xs-down">
                            <a class="col-lg-8 col-sm-8" href='https://itunes.apple.com/us/app/oneclickdigital/id515311743?mt=8'> <img class='img-responsive pad5f' src='https://s3.amazonaws.com/toledolibrary/uploads/images/AppStore.jpg' /> </a>
                            <a class="col-lg-8 col-sm-8" href='https://play.google.com/store/apps/details?id=com.ocd'><img class='img-responsive pad5l' src='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg' /> </a>
                        </div>
                        <div class="col-xs-24 col-sm-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://itunes.apple.com/us/app/oneclickdigital/id515311743?mt=8'> <img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/AppStore.jpg' /> </a>
                        </div>
                        <div class="col-xs-24 col-sm-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://play.google.com/store/apps/details?id=com.ocd'><img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg' /> </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search-result filtered-card col-xs-24 col-sm-24 col-lg-12 emagazines iphone-or-ipad iphone ipod-touch kindle-fire kindle-fire-hd pc mac android-phone-or-tablet chromebook">
                <div class="card tool-card">
                    <h3 class="hidden-xs-down">RBdigital/eMagazines
                        <i class="fa flright fa-columns"></i>
                    </h3>
                    <h3 class="hidden-sm-up">RB/eMagazines
                        <i class="fa flright fa-columns"></i>
                    </h3>
                    <div class="card-details">
                        <p> <strong>Formats:</strong> eMagazines
                            <br/>
                            <strong>Features:</strong> No checkout time limit, no limit to checkouts, no waiting, previous issues available
                        </p>

                        <div class="col-lg-24">
                            <a class="btn btn-cardinal" href="https://www.rbdigital.com/toledolucascooh"> Access RBdigital</a>
                        </div>
                        <div class="col-lg-24 col-sm-24 paddingtop10 hidden-xs-down">
                            <a class="col-lg-8 col-sm-8" href='https://itunes.apple.com/us/app/oneclickdigital/id515311743?mt=8'> <img class='img-responsive pad5f' src='https://s3.amazonaws.com/toledolibrary/uploads/images/AppStore.jpg' /> </a>
                            <a class="col-lg-8 col-sm-8" href='https://play.google.com/store/apps/details?id=com.ocd'><img class='img-responsive pad5l' src='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg' /> </a>
                        </div>
                        <div class="col-xs-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://itunes.apple.com/us/app/oneclickdigital/id515311743?mt=8'> <img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/AppStore.jpg' /> </a>
                        </div>
                        <div class="col-xs-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://play.google.com/store/apps/details?id=com.ocd'><img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg' /> </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search-result filtered-card col-xs-24 col-sm-24 col-lg-12 ebooks movies iphone-or-ipad iphone ipod-touch kindle-fire kindle-fire-hd pc mac android-phone-or-tablet chromebook">
                <div class="card tool-card">
                    <h3>BookFLIX Website
                        <i class="fa flright fa-tablet"></i>
                        <i class="fa flright fa-television"></i>
                    </h3>
                    <div class="card-details">
                        <p> <strong>Formats:</strong> eBooks, Movies
                            <br/>
                            <strong>Features:</strong> No waiting, animated picture books, all ages, some in Spanish
                            <br><br>
                            <small>Sorry! We are experiencing problems accessing BookFLIX outside of the Library. We are working on a solution. You may need to enter a username and password. <br/>
                                <strong>Username:</strong> nmz
                                <br>
                                <strong>Password:</strong> flix
                            </small>
                        </p>
                        <a class="btn btn-cardinal" href="http://api.toledolibrary.org/db_referrer2.asp?code=bookflix">Access BookFLIX</a>
                    </div>
                </div>
            </div>
            <div class="search-result filtered-card col-xs-24 col-sm-24 col-lg-12 ebooks movies iphone-or-ipad iphone ipod-touch kindle-fire kindle-fire-hd pc mac android-phone-or-tablet chromebook">
                <div class="card tool-card">
                    <h3>ScienceFLIX Website
                        <i class="fa flright fa-tablet"></i>
                        <i class="fa flright fa-television"></i>
                    </h3>
                    <div class="card-details">
                        <p> <strong>Formats:</strong> eBooks, Movies
                            <br/>
                            <strong>Features:</strong> No waiting, science topics, all ages
                            <br><br>
                            <small>Sorry! We are experiencing problems accessing ScienceFLIX outside of the Library. We are working on a solution. You may need to enter a username and password. <br/>
                                <strong>Username:</strong> nmz
                                <br>
                                <strong>Password:</strong> flix
                            </small>
                        </p>
                        <a class="btn btn-cardinal" href="http://api.toledolibrary.org/db_referrer2.asp?code=sciflix">Access ScienceFLIX</a>
                    </div>
                </div>
            </div>
            <div class="search-result filtered-card col-xs-24 col-sm-24 col-lg-12 ebooks movies iphone-or-ipad iphone ipod-touch kindle-fire kindle-fire-hd pc mac android-phone-or-tablet chromebook">
                <div class="card tool-card">
                    <h3>TrueFLIX Website
                        <i class="fa flright fa-tablet"></i>
                        <i class="fa flright fa-television"></i>
                    </h3>
                    <div class="card-details">
                        <p> <strong>Formats:</strong> eBooks, Movies
                            <br/>
                            <strong>Features:</strong> No waiting, for grades 3-5, focus on science and social studies
                            <br><br>
                            <small>Sorry! We are experiencing problems accessing TrueFLIX outside of the Library. We are working on a solution. You may need to enter a username and password. <br/>
                                <strong>Username:</strong> nmz
                                <br>
                                <strong>Password:</strong> flix
                            </small>
                        </p>
                        <a class="btn btn-cardinal" href="http://api.toledolibrary.org/db_referrer2.asp?code=tfxgr">Access TrueFLIX</a>
                    </div>
                </div>
            </div>
            <div class="search-result filtered-card col-xs-24 col-sm-24 col-lg-12 ebooks eaudiobooks ipod ipod-classic ipod-mini ipod-shuffle kindle-ereader nook-hd nook-tablet nook-first nook-simple">
                <div class="card tool-card">
                    <h3>Overdrive - Sideloaded
                        <i class="fa flright fa-headphones"></i>
                    </h3>
                    <div class="card-details">
                        <p> <strong>Formats:</strong> eBooks, eAudiobooks
                                <br/>
                            <strong>Features:</strong> Largest selection of content
                                <br/>
                            <small>Limit of 20 checkouts at a time</small>
                        </p>
                            <a href="https://toledo.overdrive.com/library/kids">Access just for Kids</a>
                            <br/>
                            <a href="https://toledo.overdrive.com/library/teens">Access just for Teens</a>
                        </p>
                        <div class="col-lg-24">
                            <a class="btn btn-cardinal" href="https://toledo.overdrive.com/">Access Overdrive</a>
                        </div>
                        <div class="col-lg-24">
                        	<br /> Learn how to <strong>sideload</strong> content to your device.
                        </div>
                        <div class="col-lg-24">
                        	<a href="http://www.toledolibrary.org/uploads/images/iPod-Guide.pdf"> iPod </a> | 
                        	<a href="http://www.toledolibrary.org/uploads/images/Quick-Start-Guide-OverDrive-for-Kindle-e-Reader.pdf"> Kindle e-Reader (non wifi versions) </a> | 
                        	<a href="http://www.toledolibrary.org/uploads/images/Quick-Start-Guide-for-Nook.pdf"> Nook and Nook HD</a>
                        </div>
                        <!--
                        <div class="col-lg-24 col-sm-24 paddingtop10 hidden-xs-down">
                            <a class="col-lg-8 col-sm-8" href='https://goo.gl/6tyS76'> <img class='img-responsive pad5f' src='https://s3.amazonaws.com/toledolibrary/uploads/images/AppStore.jpg' /> </a>
                            <a class="col-lg-8 col-sm-8" href='https://goo.gl/XLu9vF'><img class='img-responsive pad5' src='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg' /> </a>
                            <a class="col-lg-8 col-sm-8" href='https://goo.gl/9SEdtT'><img class='img-responsive pad5l' src='https://s3.amazonaws.com/toledolibrary/uploads/images/windows-store-badge.png' /> </a>
                        </div>
                        <div class="col-xs-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://goo.gl/6tyS76'> <img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/AppStore.jpg' /> </a>
                        </div>
                        <div class="col-xs-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://goo.gl/XLu9vF'><img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/App_googlePlay_button.jpg' /> </a>
                        </div>
                        <div class="col-xs-24 paddingtop10 hidden-sm-up">
                            <a class="col-xs-18" href='https://goo.gl/9SEdtT'><img class='img-responsive' src='https://s3.amazonaws.com/toledolibrary/uploads/images/windows-store-badge.png' /> </a>
                        </div>
                        -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <section class="content-block one-column-text-block">
    	<div class="row library-parchment">
		    <div class="col-md-24 col-lg-24 padding-sm one-column-text-column" style="">
    	If the device or app is problematic, please check with a Librarian about specific questions or call the Audiovisual department at <a href="tel:4192595200">419.259.5200</a>. Not all apps work on all devices. Certain software versions and updates may be required.
    		</div>
    	</div>
    </section>
</section>




<div class="row footer padding-lg">
<div name=webfooter[]" id="webfooter"></div>


