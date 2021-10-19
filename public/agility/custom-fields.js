var baseUrl = "https://ujet-main.vercel.app/";

var HeadingField = function () {
  var self = this;
  self.Label = "Heading"; //[Required] the name of the custom field as will appear in content/module def form builder
  self.ReferenceName = "Heading"; //[Required] the reference name of the custom field for internal purposes

  // The Render handler for this field.  Create any elements and bindings that you might need, pull down resources.
  self.Render = function (options) {
    // get our base element
    var selector = ".heading-field";
    var $pnl = $(selector, options.$elem);

    if ($pnl.size() == 0) {
      // pull down the html template and load it into the element
      $.get(
        baseUrl + "html/heading-field-template.html",
        function (htmlContent) {
          options.$elem.append(htmlContent);

          $pnl = $(selector, options.$elem);

          // bind our viewmodel to this
          var viewModel = new (function () {
            var self = this;

            // set the default bindings. These values are updated from the html template
            self.defaultBinding = {
              type: ko.observable(null),
              text: ko.observable(null),
              classes: ko.observable(null),
            };

            self.fieldBinding = ko.observable(null);

            // init a default if null
            if (
              options.fieldBinding() == null ||
              options.fieldBinding() == ""
            ) {
              var copy = self.defaultBinding;
              self.fieldBinding(copy); //init defaults
            } else {
              // set observables on the existing binding properties
              var existingBinding = ko.mapping.fromJSON(options.fieldBinding());
              self.fieldBinding(existingBinding);
            }

            // whenever any sub-property in the fieldBinding changes update the main field binding in the model
            ko.computed(function () {
              return ko.mapping.toJSON(self.fieldBinding);
            }).subscribe(function () {
              var fieldBindingJSON = ko.mapping.toJSON(self.fieldBinding());
              options.fieldBinding(fieldBindingJSON);
            });
          })();

          ko.applyBindings(viewModel, $pnl.get(0));
        }
      );
    }
  };
};

ContentManager.Global.CustomInputFormFields.push(new HeadingField());
