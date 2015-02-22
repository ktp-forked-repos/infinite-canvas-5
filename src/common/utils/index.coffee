require './services/module_extension'
require './services/observable_mixin'
require './services/request_aborter_service'


angular.module 'quickstartApp.common.utils', [
  'quickstartApp.common.utils.services.Module'
  'quickstartApp.common.utils.services.ObservableMixin'
  'quickstartApp.common.utils.services.RequestAborterMixin'
]
