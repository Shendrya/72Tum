/**
 * @package     Joomla.Site
 * @subpackage  Templates.protostar
 * @copyright   Copyright (C) 2005 - 2017 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @since       3.2
 */

(function ($) {
    $(document).ready(function () {
        $(".main-content table").addClass("table table-responsive-md table-sm table-bordered");

        $("#searchToggle, header .search_cancel").click(function (e) {
            e.preventDefault();
            $("header .search").toggleClass("d-none");
            $("header .main_menu").toggleClass("d-none");
            $("header .search_top").toggleClass("d-none");
        });

        $("*[rel=tooltip]").tooltip();

        // Turn radios into btn-group
        $(".radio.btn-group label").addClass("btn");

        $("fieldset.btn-group").each(function () {
            // Handle disabled, prevent clicks on the container, and add disabled style to each button
            if ($(this).prop("disabled")) {
                $(this).css("pointer-events", "none").off("click");
                $(this).find(".btn").addClass("disabled");
            }
        });

        $(".btn-group label:not(.active)").click(function () {
            var label = $(this);
            var input = $("#" + label.attr("for"));

            if (!input.prop("checked")) {
                label.closest(".btn-group").find("label").removeClass("active btn-success btn-danger btn-primary");
                if (input.val() == "") {
                    label.addClass("active btn-primary");
                } else if (input.val() == 0) {
                    label.addClass("active btn-danger");
                } else {
                    label.addClass("active btn-success");
                }
                input.prop("checked", true);
                input.trigger("change");
            }
        });
        $(".btn-group input[checked=checked]").each(function () {
            if ($(this).val() == "") {
                $("label[for=" + $(this).attr("id") + "]").addClass("active btn-primary");
            } else if ($(this).val() == 0) {
                $("label[for=" + $(this).attr("id") + "]").addClass("active btn-danger");
            } else {
                $("label[for=" + $(this).attr("id") + "]").addClass("active btn-success");
            }
        });

        $("#back-top").on("click", function (e) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, 1000);
        });

        $(".tabs .tab").click(function (e) {
            e.preventDefault();
            $(this).addClass("active").siblings().removeClass("active");
            $(".tabs-content .content").removeClass("active");
            $(".tabs-content .content").eq($(this).index()).addClass("active");
        });

        $("#toggleMobile").click(function (e) {
            e.preventDefault();
            $(".main_menu").toggleClass("active");
        });

        $(".industry-line a").click(function (e) {
            e.preventDefault();
            $(".industry-line a").removeClass("active");
            $(this).addClass("active");
            $(".industry-categories").addClass("d-none");
            $(".industry-categories.industry-" + $(this).data("industry")).removeClass("d-none");
        });

        $("#callbackDialog form").submit(function (e) {
            e.preventDefault();
            if ($("#callbackDialog input[name=name]").val() && $("#callbackDialog input[name=phone]").val()) {
                $.post("/index.php?option=com_ajax&ignoreMessages&plugin=callback&format=json", $("#callbackDialog form").serialize()).always(function () {
                    $("#callbackDialog").modal("hide");
                });
            } else {
                alert("РќРµ Р·Р°РїРѕР»РЅРµРЅС‹ РѕР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ РїРѕР»СЏ");
            }
        });

        $("#priceDialog form").submit(function (e) {
            e.preventDefault();
            if ($("#priceDialog input[name=name]").val() && ($("#priceDialog input[name=phone]").val() || $("#priceDialog input[name=email]").val())) {
                $.post("/index.php?option=com_ajax&ignoreMessages&plugin=pricelist&format=json", $("#priceDialog form").serialize()).always(function () {
                    $("#priceDialog").modal("hide");
                });
            } else {
                alert("РќРµ Р·Р°РїРѕР»РЅРµРЅС‹ РѕР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ РїРѕР»СЏ");
            }
        });
    });
})(jQuery);
