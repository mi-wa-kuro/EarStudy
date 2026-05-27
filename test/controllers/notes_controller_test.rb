require "test_helper"

class NotesControllerTest < ActionDispatch::IntegrationTest
  test "should redirect to sign in when not logged in" do
    get notes_url
    assert_redirected_to new_user_session_url
  end
end
