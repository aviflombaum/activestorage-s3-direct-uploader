class TracksController < ApplicationController
  def new
  end

  def create
    @track = Track.new(track_params)
    @track.audio_file.attach(params[:signed_blob_id])
    if @track.save
      render json: @track, status: :created
    end
  end

  private

  def track_params
    params.require(:track).permit(:title, :artist_name, :filename)
  end
end
