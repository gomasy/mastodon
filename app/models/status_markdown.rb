# frozen_string_literal: true

# == Schema Information
#
# Table name: status_markdowns
#
#  id         :bigint(8)        not null, primary key
#  status_id  :bigint(8)        not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class StatusMarkdown < ApplicationRecord
  belongs_to :status
end
