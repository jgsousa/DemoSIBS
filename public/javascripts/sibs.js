var wpwlOptions = {
    style: "plain",
    locale: "pt",
    showCVVHint: true,
    brandDetection: true,
    useSummaryPage: true,
    onSaveTransactionData: function (data) {
        console.log(data);
        location.href = "https://localhost:8030/summary?checkoutId=" + data.ndc;
    },
    onReady: function(){
        $(".wpwl-group-cardNumber").after($(".wpwl-group-brand").detach());
        $(".wpwl-group-cvv").after( $(".wpwl-group-cardHolder").detach());
        var visa = $(".wpwl-brand:first").clone().removeAttr("class").attr("class", "wpwl-brand-card wpwl-brand-custom wpwl-brand-VISA")
        var master = $(visa).clone().removeClass("wpwl-brand-VISA").addClass("wpwl-brand-MASTER");
        $(".wpwl-brand:first").after( $(master)).after( $(visa));
    },
    onChangeBrand: function(e){
        $(".wpwl-brand-custom").css("opacity", "0.3");
        $(".wpwl-brand-" + e).css("opacity", "1");
    }
};
