class NotesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_note, only: %i[edit update destroy]

  def index
    @notes = current_user.notes
  end

  def new
    @note = current_user.notes.build
  end

  def create
    @note = current_user.notes.build(note_params)

    if @note.save
      redirect_to notes_path, notice: "ノートを投稿しました"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @note.update(note_params)
      redirect_to notes_path, notice: "学習ノートを更新しました"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @note.destroy

    redirect_to notes_path, notice: "学習ノートを削除しました"
  end

  private

  def set_note
    @note = current_user.notes.find(params[:id])
  end

  def note_params
    params.require(:note).permit(:title, :content)
  end
end