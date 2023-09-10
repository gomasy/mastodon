# frozen_string_literal: true

class REST::StatusSourceSerializer < ActiveModel::Serializer
  attributes :id, :text, :spoiler_text, :markdown

  def id
    object.id.to_s
  end

  def markdown
    StatusMarkdown.where(status_id: object.id).exists?
  end
end
