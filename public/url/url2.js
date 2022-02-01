console.log("ready!");
var $webUrl = $("#website_url");
var $faResult = $("#facebook-result-final");
var $liResult = $("#linkedin-result-final");
var $twResult = $("#twitter-result-final");
var $yuResult = $("#youtube-result-final");
var $campName2 = $("#campaign_name2");
var $caNameResult2 = $("#ca-campaign2");
var $input = $("#social-form input");
var $select = $("#social-form select");
var $textarea = $("#social-form textarea");

$(".lowercase").bind("change keyup paste contextmenu input", function (e) {
  $(this).val(function (_, v) {
    return v.toLowerCase();
  });
});

function urlClean(url) {
  url.val(function (_, v) {
    return v.trimStart().trimEnd().replace(/\s+/g, "%20").toLowerCase();
  });
}

$(".underscore").bind("change keyup paste contextmenu input", function (e) {
  $(this).val(function (_, v) {
    return v.replace(/\s+/g, "_").toLowerCase();
  });
});

var $camName2 = $("#campaign_name2").val();
function getCapName($camName2) {
  return $camName2 ? "&utm_campaign=" + $camName2 : "";
}

$campName2.on("change keyup paste contextmenu input", function () {
  if ($(this).val().length == 0) {
    $caNameResult2.text("");
    socialInputChanger();
  } else {
    $caNameResult2.text("&utm_campaign=" + $(this).val().toLowerCase());
    socialInputChanger();
  }
});

var $faResultTemp = $("#ca-campaign-fa");
var $liResultTemp = $("#ca-campaign-li");
var $twResultTemp = $("#ca-campaign-tw");
var $yuResultTemp = $("#ca-campaign-yu");

$webUrl.bind("change keyup paste contextmenu input", function () {
  urlClean($(this));
  var $validURL = $(this)
    .val()
    .match(/^http([s]?):\/\/.*/);
  if ($(this).val().length < 8 || !$validURL) {
    $(this).removeClass("valid");
    $faResultTemp.text("");
    $liResultTemp.text("");
    $twResultTemp.text("");
    $yuResultTemp.text("");
    $faResult.val("");
    $liResult.val("");
    $twResult.val("");
    $yuResult.val("");
  } else {
    $(this).removeClass("valid").addClass("valid");
    socialInputChanger();

    var $trimTxtSocial = $(this).val();

    if ($trimTxtSocial.indexOf("?") !== -1) {
      $faResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=facebook&utm_medium=social&cls=MKTG&clp=Social_Media"
      );
      $liResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=linkedin&utm_medium=social&cls=MKTG&clp=Social_Media"
      );
      $twResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=twitter&utm_medium=social&cls=MKTG&clp=Social_Media"
      );
      $yuResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=youtube&utm_medium=social&cls=MKTG&clp=Social_Media"
      );
    } else {
      $faResultTemp.text(
        $(this).val() +
          "?utm_source=facebook&utm_medium=social&cls=MKTG&clp=Social_Media"
      );
      $liResultTemp.text(
        $(this).val() +
          "?utm_source=linkedin&utm_medium=social&cls=MKTG&clp=Social_Media"
      );
      $twResultTemp.text(
        $(this).val() +
          "?utm_source=twitter&utm_medium=social&cls=MKTG&clp=Social_Media"
      );
      $yuResultTemp.text(
        $(this).val() +
          "?utm_source=youtube&utm_medium=social&cls=MKTG&clp=Social_Media"
      );
    }
  }
});

function socialInputChanger() {
  $faResult.val(
    $.trim($faResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );

  $liResult.val(
    $.trim($liResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );

  $twResult.val(
    $.trim($twResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );

  $yuResult.val(
    $.trim($yuResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );

  if (
    !($faResultTemp.text() == 0) ||
    !($liResultTemp.text() == 0) ||
    !($twResultTemp.text() == 0) ||
    !($yuResultTemp.text() == 0) ||
    !($caNameResult2.text() == 0)
  ) {
    $faResult.addClass("key");
    $liResult.addClass("key");
    $twResult.addClass("key");
    $yuResult.addClass("key");
  } else {
    $faResult.removeClass("key");
    $liResult.removeClass("key");
    $twResult.removeClass("key");
    $yuResult.removeClass("key");
  }
}

$("#clear").on("click", function (e) {
  e.preventDefault();
  $webUrl.val("");
  $faResult.val("");
  $liResult.val("");
  $twResult.val("");
  $yuResult.val("");
  $faResultTemp.text("");
  $liResultTemp.text("");
  $twResultTemp.text("");
  $yuResultTemp.text("");
  $caNameResult2.text("");
  $campName2.val("");
  $input.val("");
  $select.val("");

  $faResult.removeClass("key");
  $liResult.removeClass("key");
  $twResult.removeClass("key");
  $yuResult.removeClass("key");

  $input.removeClass("valid");
  $select.removeClass("valid");
  $textarea.removeClass("valid");

  $("#social-form .text-copied").remove();
});

$("textarea.all-text").focus(function () {
  var $this = $(this);
  $this.select();
  $this.mouseup(function () {
    // Prevent further mouseup intervention
    $this.unbind("mouseup");
    return false;
  });
});

// Start sectopm 2
var $webUrlAd = $("#website_url_ad");
var $goAdResult = $("#google-ad-result-final");
var $liAdResult = $("#linkedin-ad-result-final");
var $campNameAd = $("#campaign_name-ad");
var $caNameResultAd = $("#ca-campaign-ad");
var $goAdResultTemp = $("#ca-campaign-go-ad");
var $liAdResultTemp = $("#ca-campaign-li-ad");
var $inputAd = $("#ad-form input");
var $selectAd = $("#ad-form select");
var $textareaAd = $("#ad-form textarea");

$campNameAd.on("change keyup paste contextmenu input", function () {
  if ($(this).val().length == 0) {
    $caNameResultAd.text("");
    adInputChanger();
  } else {
    $caNameResultAd.text("&utm_campaign=" + $(this).val().toLowerCase());
    adInputChanger();
  }
});

$campName2.on("change keyup paste contextmenu input", function () {
  if ($(this).val().length == 0) {
    $caNameResult2.text("");
    socialInputChanger();
  } else {
    $caNameResult2.text("&utm_campaign=" + $(this).val().toLowerCase());
    socialInputChanger();
  }
});

$webUrlAd.bind("change keyup paste contextmenu input", function () {
  urlClean($(this));
  var $validURL = $(this)
    .val()
    .match(/^http([s]?):\/\/.*/);
  if ($(this).val().length < 8 || !$validURL) {
    $(this).removeClass("valid");
    $goAdResultTemp.text("");
    $liAdResultTemp.text("");
    $goAdResult.val("");
    $liAdResult.val("");
  } else {
    $(this).removeClass("valid").addClass("valid");
    adInputChanger();

    var $trimTxtSocial = $(this).val();

    if ($trimTxtSocial.indexOf("?") !== -1) {
      $goAdResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=google&utm_medium=cpc&cls=MKTG&clp=Digital_Adv"
      );
      $liAdResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=linkedin&utm_medium=cpc&cls=MKTG&clp=Digital_Adv"
      );
    } else {
      $goAdResultTemp.text(
        $(this).val() +
          "?utm_source=google&utm_medium=cpc&cls=MKTG&clp=Digital_Adv"
      );
      $liAdResultTemp.text(
        $(this).val() +
          "?utm_source=linkedin&utm_medium=cpc&cls=MKTG&clp=Digital_Adv"
      );
    }
  }
});

function adInputChanger() {
  $goAdResult.val(
    $.trim($goAdResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResultAd.text().replace(/(\r\n|\n|\r)/gm, ""))
  );

  $liAdResult.val(
    $.trim($liAdResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResultAd.text().replace(/(\r\n|\n|\r)/gm, ""))
  );

  if (
    !($goAdResultTemp.text() == 0) ||
    !($liAdResultTemp.text() == 0) ||
    !($caNameResultAd.text() == 0)
  ) {
    $goAdResult.addClass("key");
    $liAdResult.addClass("key");
  } else {
    $goAdResult.removeClass("key");
    $liAdResult.removeClass("key");
  }
}

$("#clear-ad").on("click", function (e) {
  e.preventDefault();
  $webUrlAd.val("");
  $goAdResult.val("");
  $liAdResult.val("");
  $goAdResultTemp.text("");
  $liAdResultTemp.text("");
  $caNameResultAd.text("");
  $campNameAd.val("");
  $inputAd.val("");
  $selectAd.val("");

  $goAdResult.removeClass("key");
  $liAdResult.removeClass("key");

  $inputAd.removeClass("valid");
  $selectAd.removeClass("valid");
  $textareaAd.removeClass("valid");

  $("#ad-form .text-copied").remove();
});

//  Start section 3

var $webUrl2 = $("#website_url2");
var $caSource = $("#campaign_source");
var $caMedium = $("#campaign_medium");
var $caName = $("#campaign_name");
var $caContent = $("#campaign_content");
var $urlResult = $("#url-result");
var $caSourceResult = $("#ca-source");
var $caMediumResult = $("#ca-medium");
var $caNameResult = $("#ca-campaign");
var $caContentResult = $("#ca-content");
var $urlResultFinal = $("#url-result-final");
var $input2 = $("#url-form input");
var $select2 = $("#url-form select");
var $textarea2 = $("#url-form textarea");

var $cls = $("#cls");
var $clp = $("#clp");
var $caClsResult = $("#ca-cls");
var $caClpResult = $("#ca-clp");
var $clss = $("#clss");
var $clps = $("#clps");

$webUrl2.on("change keyup paste contextmenu input", function () {
  urlClean($(this));
  var $validURL = $(this)
    .val()
    .match(/^http([s]?):\/\/.*/);
  if ($(this).val().length < 8 || !$validURL) {
    console.log("no valid!");
    $(this).removeClass("valid");
    $urlResult.text("");
    $urlResultFinal.val("");
  } else {
    webUrlChanger();
    $(this).removeClass("valid").addClass("valid");
    var $trimTxt = $(this)
      .val()
      .replace(/(\r\n|\n|\r)/gm, "");

    if ($trimTxt.indexOf("?") !== -1) {
      $urlResult.text($trimTxt.substring(0, $trimTxt.indexOf("?")) + "?");
    } else {
      $urlResult.text(
        $(this)
          .val()
          .replace(/(\r\n|\n|\r)/gm, "") + "?"
      );
    }
  }
});

$caMedium.on("change keyup paste contextmenu input", function () {
  if ($(this).val().length == 0) {
    $caMediumResult.text("");
  } else {
    webUrlChanger();
    $caMediumResult.text("utm_medium=" + $(this).val().toLowerCase());
  }
});

$caSource.on("change keyup paste contextmenu input", function () {
  if ($(this).val().length == 0) {
    $caSourceResult.text("");
  } else {
    webUrlChanger();
    $caSourceResult.text("&utm_source=" + $(this).val().toLowerCase());
  }
});

$caName.on("change keyup paste contextmenu input", function () {
  if ($(this).val().length == 0) {
    $caNameResult.text("");
  } else {
    webUrlChanger();
    $caNameResult.text("&utm_campaign=" + $(this).val().toLowerCase());
  }
});

$cls.on("change keyup paste contextmenu input", function () {
  if ($(this).val().length == 0) {
    $caClsResult.text("");
  } else {
    webUrlChanger();
    $caClsResult.text("&cls=" + $(this).val());
  }
});

$clp.on("change keyup paste contextmenu input", function () {
  if ($(this).val().length == 0) {
    $caClpResult.text("");
  } else {
    webUrlChanger();
    $caClpResult.text("&clp=" + $(this).val());
  }
});

$caContent.on("change keyup paste contextmenu input", function () {
  if ($(this).val().length == 0) {
    $caContentResult.text("");
  } else {
    webUrlChanger();
    $caContentResult.text("&utm_content=" + $(this).val().toLowerCase());
  }
});

function webUrlChanger() {
  $urlResultFinal.val(
    $.trim($urlResult.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caMediumResult.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caSourceResult.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caContentResult.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caClsResult.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caClpResult.text().replace(/(\r\n|\n|\r)/gm, ""))
  );
  if (
    !($urlResult.text() == 0) ||
    !($caSourceResult.text() == 0) ||
    !($caMediumResult.text() == 0) ||
    !($caNameResult.text() == 0)
  ) {
    $urlResultFinal.addClass("key");
  } else {
    $urlResultFinal.removeClass("key");
  }
}

$("#clear2").on("click", function (e) {
  e.preventDefault();
  $webUrl2.val("");
  $caSource.val("");
  $caMedium.val("");
  $caName.val("");
  $caContent.val("");

  $cls.val("");
  $clp.val("");
  $caClsResult.text("");
  $caClpResult.text("");
  $clss.val("");
  $clps.val("");
  $input2.val("");
  $select2.val("");

  $urlResult.text("");
  $caSourceResult.text("");
  $caMediumResult.text("");
  $caNameResult.text("");
  $caContentResult.text("");
  $urlResultFinal.val("").removeClass("key");

  $input2.removeClass("valid");
  $select2.removeClass("valid");
  $textarea2.removeClass("valid");

  $("#url-form .text-copied").remove();
});

$("input").on("change keyup paste contextmenu input", function () {
  if ($(this).val().length > 0) {
    $(this).removeClass("valid").addClass("valid");
  } else {
    $(this).removeClass("valid");
  }
});

//  Click events

const scriptURL =
  "https://script.google.com/macros/s/AKfycbwja_tNMkakgHrHPsZqTPWSb06w2tZWN-cHnjSzoyA4ZBSFIq6Ewk0xFQ/exec";
const formSocial = document.forms["url-parameters"];
const enteredURL = document.getElementById("website_url");
let pageURL = document.getElementById("page-url");

const enteredURLAd = document.getElementById("website_url_ad");
let pageURLAd = document.getElementById("page-url-ad");

const facebookSource = document.getElementById("ca-campaign-fa");
const linkedinSource = document.getElementById("ca-campaign-li");
const twitterSource = document.getElementById("ca-campaign-tw");
const youtubeSource = document.getElementById("ca-campaign-yu");
let caSource = document.getElementById("ca-source");
let caMedium = document.getElementById("ca-medium");
let assetName = document.getElementById("Asset_Name");
let assetPurpose = document.getElementById("Asset_Purpose");
const assetPurposeEntered = document.getElementById("Asset-Purpose");
const assetNameEntered = document.getElementById("Asset-Name");
let currentLeadProgram = document.getElementById("ca-clp2");
let currentLeadSource = document.getElementById("ca-cls2");
const facebokFinal = document.getElementById("facebook-result-final");
const linkedinFinal = document.getElementById("linkedin-result-final");
const twitterFinal = document.getElementById("twitter-result-final");
const youtubeFinal = document.getElementById("youtube-result-final");

const formAd = document.forms["ad-form"];
const googleAdFinal = document.getElementById("google-ad-result-final");
const linkedinAdFinal = document.getElementById("linkedin-ad-result-final");
let caSourceAd = document.getElementById("ca-source-ad");
let caMediumAd = document.getElementById("ca-medium-ad");
let assetNameAd = document.getElementById("Asset_Name-ad");
let assetPurposeAd = document.getElementById("Asset_Purpose-ad");
const assetPurposeEnteredAd = document.getElementById("Asset-Purpose-ad");
const assetNameEnteredAd = document.getElementById("Asset-Name-ad");
const linkedinAdSource = document.getElementById("ca-campaign-li-ad");
const googleAdSource = document.getElementById("ca-campaign-go-ad");

let campaignURL = document.getElementById("ca-url");
let campaignURLAd = document.getElementById("ca-url-ad");
let currentLeadSourceAd = document.getElementById("ca-cls-ad");
let currentLeadProgramAd = document.getElementById("ca-clp-ad");

const form = document.forms["url-parameters2"];
const urlFinal2 = document.querySelector("#url-result-final");

function copyUrl(url) {
  let hasTextCopied = url.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    let span = document.createElement("span");
    span.className = "text-copied";
    span.innerText = "The url is recorded successfully.";
    url.appendChild(span);
  }
}

facebokFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURL.value = enteredURL.value;
  e.target.classList.add("valid");
  caSource.value = "facebook";
  caMedium.value = "social";
  currentLeadProgram.value = "Social_Media";
  currentLeadSource.value = "MKTG";
  assetName.value = assetNameEntered.value;
  assetPurpose.value = " - Social - Facebook";
  campaignURL.value = facebokFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});
linkedinFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURL.value = enteredURL.value;
  e.target.classList.add("valid");
  caSource.value = "linkedin";
  caMedium.value = "social";
  currentLeadProgram.value = "Social_Media";
  currentLeadSource.value = "MKTG";
  assetName.value = assetNameEntered.value;
  assetPurpose.value = " - Social - Linkedin";
  campaignURL.value = linkedinFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});
twitterFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURL.value = enteredURL.value;
  e.target.classList.add("valid");
  caSource.value = "twitter";
  caMedium.value = "social";
  currentLeadProgram.value = "Social_Media";
  currentLeadSource.value = "MKTG";
  assetName.value = assetNameEntered.value;
  assetPurpose.value = " - Social - Twitter";
  campaignURL.value = twitterFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});
youtubeFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURL.value = enteredURL.value;
  e.target.classList.add("valid");
  caSource.value = "youtube";
  caMedium.value = "social";
  currentLeadProgram.value = "Social_Media";
  currentLeadSource.value = "MKTG";
  assetName.value = assetNameEntered.value;
  assetPurpose.value = " - Social - YouTube";
  campaignURL.value = youtubeFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});

googleAdFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURLAd.value = enteredURLAd.value;
  e.target.classList.add("valid");
  caMediumAd.value = "cpc";
  caSourceAd.value = "google";
  assetNameAd.value = assetNameEnteredAd.value;
  assetPurposeAd.value = " - Dig Adv - Google";
  campaignURLAd.value = googleAdFinal.value;
  currentLeadSourceAd.value = "MKTG";
  currentLeadProgramAd.value = "Digital_Adv";
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formAd) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});
linkedinAdFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURLAd.value = enteredURLAd.value;
  e.target.classList.add("valid");
  caMediumAd.value = "cpc";
  caSourceAd.value = "linkedin";
  assetNameAd.value = assetNameEnteredAd.value;
  assetPurposeAd.value = " - Dig Adv - LinkedIn";
  campaignURLAd.value = linkedinAdFinal.value;
  currentLeadSourceAd.value = "MKTG";
  currentLeadProgramAd.value = "Digital_Adv";
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formAd) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});

urlFinal2.addEventListener("click", (e) => {
  e.preventDefault();
  e.target.classList.add("valid");
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});

$("#primary-nav a").on("click", function (event) {
  event.preventDefault();
  $("html, body").animate(
    {
      scrollTop: $($.attr(this, "href")).offset().top - 50,
    },
    500
  );
});
