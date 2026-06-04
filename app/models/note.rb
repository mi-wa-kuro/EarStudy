class Note < ApplicationRecord
  belongs_to :user

  validates :title, presence: true, uniqueness: { scope: :user_id }
  validates :content, presence: true
end