console.log("ready!");
var $webUrl = $("#website_url");
var $faResult = $("#facebook-result-final");
var $liResult = $("#linkedin-result-final");
var $twResult = $("#twitter-result-final");
var $inResult = $("#instagram-result-final");
var $yuResult = $("#youtube-result-final");
var $campName2 = $("#campaign_name2");
var $caNameResult2 = $("#ca-campaign2");
var $input = $("#social-form input");
var $select = $("#social-form select");
var $textarea = $("#social-form textarea");

var $goAdResult = $("#google-ad-result-final");
var $liAdResult = $("#linkedin-ad-result-final");
var $faAdResult = $("#facebook-ad-result-final");

var $emailResult = $("#email-result-final");
var $contactResult = $("#contact-result-final");
var $requestResult = $("#request-result-final");
var $blogResult = $("#blog-result-final");
var $sdrsResult = $("#sdrs-result-final");

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

var $emailResultTemp = $("#ca-campaign-email");
var $contactResultTemp = $("#ca-campaign-contact");
var $requestResultTemp = $("#ca-campaign-request");
var $blogResultTemp = $("#ca-campaign-blog");
var $sdrsResultTemp = $("#ca-campaign-sdrs");
var $faResultTemp = $("#ca-campaign-fa");
var $liResultTemp = $("#ca-campaign-li");
var $twResultTemp = $("#ca-campaign-tw");
var $inResultTemp = $("#ca-campaign-in");
var $yuResultTemp = $("#ca-campaign-yu");
var $goAdResultTemp = $("#ca-campaign-go-ad");
var $liAdResultTemp = $("#ca-campaign-li-ad");
var $faAdResultTemp = $("#ca-campaign-fa-ad");

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
    $inResultTemp.text("");
    $yuResultTemp.text("");
    $goAdResultTemp.text("");
    $liAdResultTemp.text("");
    $faAdResultTemp.text("");
    $emailResultTemp.text("");
    $contactResultTemp.text("");
    $requestResultTemp.text("");
    $blogResultTemp.text("");
    $sdrsResultTemp.text("");
    $faResult.val("");
    $liResult.val("");
    $twResult.val("");
    $inResult.val("");
    $yuResult.val("");
    $goAdResult.val("");
    $liAdResult.val("");
    $faAdResult.val("");
    $emailResult.val("");
    $contactResult.val("");
    $requestResult.val("");
    $blogResult.val("");
    $sdrsResult.val("");
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
      $inResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=instagram&utm_medium=social&cls=MKTG&clp=Social_Media"
      );
      $yuResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=youtube&utm_medium=social&cls=MKTG&clp=Social_Media"
      );
      $goAdResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=google&utm_medium=cpc&cls=MKTG&clp=Digital_Adv"
      );
      $liAdResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=linkedin&utm_medium=cpc&cls=MKTG&clp=Digital_Adv"
      );
      $faAdResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=facebook&utm_medium=cpc&cls=MKTG&clp=Digital_Adv"
      );
      $emailResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=nurture&utm_medium=email&cls=MKTG&clp=Email"
      );
      $contactResultTemp.text(
        "https://ujet.cx/contact-sales/?utm_source=nurture&utm_medium=email&cls=MKTG&clp=Email"
      );
      $requestResultTemp.text(
        "https://ujet.cx/request-a-demo/?utm_source=nurture&utm_medium=email&cls=MKTG&clp=Email"
      );
      $blogResultTemp.text(
        "https://ujet.cx/blog/?utm_source=nurture&utm_medium=email&cls=MKTG&clp=Email"
      );
      $sdrsResultTemp.text(
        $trimTxtSocial.substring(0, $trimTxtSocial.indexOf("?")) +
          "?utm_source=sdr&utm_medium=email&cls=MKTG&clp=Email"
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
      $inResultTemp.text(
        $(this).val() +
          "?utm_source=instagram&utm_medium=social&cls=MKTG&clp=Social_Media"
      );
      $yuResultTemp.text(
        $(this).val() +
          "?utm_source=youtube&utm_medium=social&cls=MKTG&clp=Social_Media"
      );
      $goAdResultTemp.text(
        $(this).val() +
          "?utm_source=google&utm_medium=cpc&cls=MKTG&clp=Digital_Adv"
      );
      $liAdResultTemp.text(
        $(this).val() +
          "?utm_source=linkedin&utm_medium=cpc&cls=MKTG&clp=Digital_Adv"
      );
      $faAdResultTemp.text(
        $(this).val() +
          "?utm_source=facebook&utm_medium=cpc&cls=MKTG&clp=Digital_Adv"
      );
      $emailResultTemp.text(
        $(this).val() +
          "?utm_source=nurture&utm_medium=email&cls=MKTG&clp=Email"
      );
      $contactResultTemp.text(
        "https://ujet.cx/contact-sales/?utm_source=nurture&utm_medium=email&cls=MKTG&clp=Email"
      );
      $requestResultTemp.text(
        "https://ujet.cx/request-a-demo/?utm_source=nurture&utm_medium=email&cls=MKTG&clp=Email"
      );
      $blogResultTemp.text(
        "https://ujet.cx/blog/?utm_source=nurture&utm_medium=email&cls=MKTG&clp=Email"
      );
      $sdrsResultTemp.text(
        $(this).val() + "?utm_source=sdr&utm_medium=email&cls=MKTG&clp=Email"
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

  $inResult.val(
    $.trim($inResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );

  $yuResult.val(
    $.trim($yuResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );

  $goAdResult.val(
    $.trim($goAdResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );

  $liAdResult.val(
    $.trim($liAdResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );

  $faAdResult.val(
    $.trim($faAdResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );

  $emailResult.val(
    $.trim($emailResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );
  $contactResult.val(
    $.trim($contactResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );
  $requestResult.val(
    $.trim($requestResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );
  $blogResult.val(
    $.trim($blogResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );
  $sdrsResult.val(
    $.trim($sdrsResultTemp.text().replace(/(\r\n|\n|\r)/gm, "")) +
      $.trim($caNameResult2.text().replace(/(\r\n|\n|\r)/gm, ""))
  );

  if (
    !($faResultTemp.text() == 0) ||
    !($liResultTemp.text() == 0) ||
    !($twResultTemp.text() == 0) ||
    !($inResultTemp.text() == 0) ||
    !($yuResultTemp.text() == 0) ||
    !($goAdResultTemp.text() == 0) ||
    !($liAdResultTemp.text() == 0) ||
    !($faAdResultTemp.text() == 0) ||
    !($emailResultTemp.text() == 0) ||
    !($contactResultTemp.text() == 0) ||
    !($requestResultTemp.text() == 0) ||
    !($blogResultTemp.text() == 0) ||
    !($sdrsResultTemp.text() == 0) ||
    !($caNameResult2.text() == 0)
  ) {
    $faResult.addClass("key");
    $liResult.addClass("key");
    $twResult.addClass("key");
    $inResult.addClass("key");
    $yuResult.addClass("key");
    $goAdResult.addClass("key");
    $liAdResult.addClass("key");
    $faAdResult.addClass("key");
    $emailResult.addClass("key");
    $contactResult.addClass("key");
    $requestResult.addClass("key");
    $blogResult.addClass("key");
    $sdrsResult.addClass("key");
  } else {
    $faResult.removeClass("key");
    $liResult.removeClass("key");
    $twResult.removeClass("key");
    $yuResult.removeClass("key");
    $goAdResult.removeClass("key");
    $liAdResult.removeClass("key");
    $faAdResult.removeClass("key");
    $emailResult.removeClass("key");
    $contactResult.removeClass("key");
    $requestResult.removeClass("key");
    $sdrsResult.removeClass("key");
  }
}

$("#clear").on("click", function (e) {
  e.preventDefault();
  $webUrl.val("");
  $emailResult.val("");
  $contactResult.val("");
  $requestResult.val("");
  $blogResult.val("");
  $sdrsResult.val("");
  $faResult.val("");
  $liResult.val("");
  $twResult.val("");
  $inResult.val("");
  $yuResult.val("");
  $goAdResult.val("");
  $liAdResult.val("");
  $faAdResult.val("");
  $faResultTemp.text("");
  $liResultTemp.text("");
  $twResultTemp.text("");
  $inResultTemp.text("");
  $yuResultTemp.text("");
  $goAdResultTemp.text("");
  $liAdResultTemp.text("");
  $faAdResultTemp.text("");
  $caNameResult2.text("");
  $campName2.val("");
  $input.val("");
  $select.val("");

  $faResult.removeClass("key");
  $liResult.removeClass("key");
  $twResult.removeClass("key");
  $inResult.removeClass("key");
  $yuResult.removeClass("key");
  $goAdResult.removeClass("key");
  $liAdResult.removeClass("key");
  $faAdResult.removeClass("key");
  $emailResult.removeClass("key");
  $contactResult.removeClass("key");
  $requestResult.removeClass("key");
  $blogResult.removeClass("key");
  $sdrsResult.removeClass("key");

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

// Click Events
const scriptURL =
  "https://script.google.com/macros/s/AKfycbwja_tNMkakgHrHPsZqTPWSb06w2tZWN-cHnjSzoyA4ZBSFIq6Ewk0xFQ/exec";
const formSocial = document.forms["url-parameters"];
const emailSource = "ca-campaign-email";
const enteredURL = document.getElementById("website_url");
let pageURL = document.getElementById("page-url");
const contactSource = document.getElementById("ca-campaign-contact");
const requestSource = document.getElementById("ca-campaign-request");
const blogSource = document.getElementById("ca-campaign-blog");
const sdrsSource = document.getElementById("ca-campaign-sdrs");
const facebookSource = document.getElementById("ca-campaign-fa");
const linkedinSource = document.getElementById("ca-campaign-li");
const twitterSource = document.getElementById("ca-campaign-tw");
const instagramSource = document.getElementById("ca-campaign-in");
const youtubeSource = document.getElementById("ca-campaign-yu");
let caSource = document.getElementById("ca-source");
let caMedium = document.getElementById("ca-medium");
const assetPurposeEntered = document.getElementById("Asset-Purpose");
const assetNameEntered = document.getElementById("Asset-Name");
let assetPurpose = document.getElementById("Asset_Purpose");
let assetName = document.getElementById("Asset_Name");
let currentLeadProgram = document.getElementById("ca-clp2");
let currentLeadSource = document.getElementById("ca-cls2");
const facebokFinal = document.getElementById("facebook-result-final");
const linkedinFinal = document.getElementById("linkedin-result-final");
const twitterFinal = document.getElementById("twitter-result-final");
const instagramFinal = document.getElementById("instagram-result-final");
const youtubeFinal = document.getElementById("youtube-result-final");

const googleAdFinal = document.getElementById("google-ad-result-final");
const googleAdSource = document.getElementById("ca-campaign-go-ad");
const linkedinAdFinal = document.getElementById("linkedin-ad-result-final");
const linkedinAdSource = document.getElementById("ca-campaign-li-ad");
const facebookAdFinal = document.getElementById("facebook-ad-result-final");
const facebookAdSource = document.getElementById("ca-campaign-fa-ad");

const emailFinal = document.getElementById("email-result-final");
const contactFinal = document.getElementById("contact-result-final");
const requestFinal = document.getElementById("request-result-final");
const blogFinal = document.getElementById("blog-result-final");
const sdrsFinal = document.getElementById("sdrs-result-final");

let campaignURL = document.getElementById("ca-url");

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

emailFinal.addEventListener("click", (e) => {
  e.preventDefault();
  e.target.classList.add("valid");
  pageURL.value = enteredURL.value;
  caSource.value = "nurture";
  caMedium.value = "email";
  currentLeadProgram.value = "Email";
  currentLeadSource.value = "MKTG";
  assetPurpose.value = " - Email";
  assetName.value = assetNameEntered.value;
  campaignURL.value = emailFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});

contactFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURL.value = "https://ujet.cx/contact-sales/";
  e.target.classList.add("valid");
  caSource.value = "nurture";
  caMedium.value = "email";
  currentLeadProgram.value = "Email";
  currentLeadSource.value = "MKTG";
  assetPurpose.value = " - Contact Us";
  assetName.value = assetNameEntered.value;
  campaignURL.value = contactFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});

requestFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURL.value = "https://ujet.cx/request-a-demo/";
  e.target.classList.add("valid");
  caSource.value = "nurture";
  caMedium.value = "email";
  currentLeadProgram.value = "Email";
  currentLeadSource.value = "MKTG";
  assetPurpose.value = " - Request Demo";
  assetName.value = assetNameEntered.value;
  campaignURL.value = requestFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});

blogFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURL.value = "https://ujet.cx/blog/";
  e.target.classList.add("valid");
  caSource.value = "nurture";
  caMedium.value = "email";
  currentLeadProgram.value = "Email";
  currentLeadSource.value = "MKTG";
  assetPurpose.value = " - Blog";
  assetName.value = assetNameEntered.value;
  campaignURL.value = blogFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});

sdrsFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURL.value = enteredURL.value;
  e.target.classList.add("valid");
  caSource.value = "sdr";
  caMedium.value = "email";
  currentLeadProgram.value = "Email";
  currentLeadSource.value = "MKTG";
  assetPurpose.value = " - SDRs";
  assetName.value = assetNameEntered.value;
  campaignURL.value = sdrsFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});

facebokFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURL.value = enteredURL.value;
  e.target.classList.add("valid");
  caSource.value = "facebook";
  caMedium.value = "social";
  currentLeadProgram.value = "Social_Media";
  currentLeadSource.value = "MKTG";
  assetPurpose.value = " - Social - Facebook";
  assetName.value = assetNameEntered.value;
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
  assetPurpose.value = " - Social - Linkedin";
  assetName.value = assetNameEntered.value;
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
  assetPurpose.value = " - Social - Twitter";
  assetName.value = assetNameEntered.value;
  campaignURL.value = twitterFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});

instagramFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURL.value = enteredURL.value;
  e.target.classList.add("valid");
  caSource.value = "instagram";
  caMedium.value = "social";
  currentLeadProgram.value = "Social_Media";
  currentLeadSource.value = "MKTG";
  assetPurpose.value = " - Social - Instagram";
  assetName.value = assetNameEntered.value;
  campaignURL.value = instagramFinal.value;
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
  assetPurpose.value = " - Social - YouTube";
  assetName.value = assetNameEntered.value;
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
  pageURL.value = enteredURL.value;
  e.target.classList.add("valid");
  caSource.value = "google";
  caMedium.value = "cpc";
  currentLeadProgram.value = "Digital_Adv";
  currentLeadSource.value = "MKTG";
  assetPurpose.value = " - Dig Adv - Google";
  assetName.value = assetNameEntered.value;
  campaignURL.value = googleAdFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});
linkedinAdFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURL.value = enteredURL.value;
  e.target.classList.add("valid");
  caSource.value = "linkedin";
  caMedium.value = "cpc";
  currentLeadProgram.value = "Digital_Adv";
  currentLeadSource.value = "MKTG";
  assetPurpose.value = " - Dig Adv - LinkedIn";
  assetName.value = assetNameEntered.value;
  campaignURL.value = linkedinAdFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  }
  copyUrl(e.target.parentNode);
});

facebookAdFinal.addEventListener("click", (e) => {
  e.preventDefault();
  pageURL.value = enteredURL.value;
  e.target.classList.add("valid");
  caSource.value = "facebook";
  caMedium.value = "cpc";
  currentLeadProgram.value = "Digital_Adv";
  currentLeadSource.value = "MKTG";
  assetPurpose.value = " - Dig Adv - Facebbook";
  assetName.value = assetNameEntered.value;
  campaignURL.value = facebookAdFinal.value;
  let hasTextCopied = e.target.parentNode.querySelector(".text-copied") != null;
  if (!hasTextCopied) {
    fetch(scriptURL, { method: "POST", body: new FormData(formSocial) })
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
