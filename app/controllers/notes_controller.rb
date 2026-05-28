class NotesController < ApplicationController
  before_action :authenticate_user!
  def index
    @notes = Note.all
  end

  def new
    @note = Note.new
  end

  def create
    @note = Note.new(note_params)

    if @note.save
      redirect_to notes_path, notice: "ノートを投稿しました"
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def note_params
    params.require(:note).permit(:title, :content)
  end
end
