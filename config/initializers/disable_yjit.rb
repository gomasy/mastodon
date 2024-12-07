# frozen_string_literal: true

# Automatically enable YJIT as of Ruby 3.3, as it brings very
# sizeable performance improvements.

# However, it increases memory usage correspondingly,
# so it is disabled in ごま丼.
Rails.application.config.yjit = false
