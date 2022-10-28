# frozen_string_literal: true

class CustomTemplatePolicy < ApplicationPolicy
  def index?
    role.can?(:manage_custom_templates)
  end

  def create?
    role.can?(:manage_custom_templates)
  end

  def enable?
    role.can?(:manage_custom_templates)
  end

  def disable?
    role.can?(:manage_custom_templates)
  end

  def destroy?
    role.can?(:manage_custom_templates)
  end
end
