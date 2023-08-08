# frozen_string_literal: true

class Api::V1::CustomTemplatesController < Api::BaseController
  vary_by '', unless: :disallow_unauthenticated_api_access?

  def index
    cache_even_if_authenticated! unless disallow_unauthenticated_api_access?
    render_with_cache(each_serializer: REST::CustomTemplateSerializer) { CustomTemplate.where(disabled: false) }
  end
end
