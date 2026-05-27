class NotesController < ApplicationController
  before_action :authenticate_user!

  def index
    @notes = Note.all
  end
end
