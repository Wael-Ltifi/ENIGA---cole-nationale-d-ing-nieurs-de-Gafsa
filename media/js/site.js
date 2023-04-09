var site = {
    init: function()
    {
        this.social_networks.init();
        this.banners.init();
        this.mobile_menu.init();
        this.scrollHeader.init();

        $('body').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass('animated');
        });
    },

    social_networks: {
        el: $('.sn-link'),
        animation: 'jello',
        init: function()
        {
            var that = this;

            this.el.on('hover', function()
            {
                $(this).addClass(that.animation);
            });

            this.el.on('blur mouseleave', function()
            {
                $(this).removeClass(that.animation);
            });
        }
    },

    banners: {
        el: $('.banner'),
        animation: 'pulse',
        init: function()
        {
            var that = this;

            this.el.on('hover', function()
            {
                $(this).addClass(that.animation);
            });

            this.el.on('blur mouseleave', function()
            {
                $(this).removeClass(that.animation);
            });
        }
    },

    mobile_menu: {
        init: function() {
            $('body').on('click', ".ed-micon", function() {
                $(".ed-mm-inn").addClass("ed-mm-act");
            });
            //MOBILE MENU CLOSE
            $('body').on('click', ".ed-mi-close", function() {
                $(".ed-mm-inn").removeClass("ed-mm-act");
            });
        }
    },

    scrollHeader : {
        init: function () {
            $(window).scroll(function (event) {
                var scroll = $(window).scrollTop();
                if(scroll >43)
                    $("header").addClass("scrollBottom");
                else
                    $("header").removeClass("scrollBottom");
            });
        }

    }

};

site.init();