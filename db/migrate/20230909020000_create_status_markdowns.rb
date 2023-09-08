# frozen_string_literal: true

class CreateStatusMarkdowns < ActiveRecord::Migration[7.0]
  def change
    create_table :status_markdowns do |t|
      t.belongs_to :status, foreign_key: { on_delete: :cascade }, null: false, unique: true

      t.timestamps null: false, default: -> { 'now()' }
    end
  end
end
