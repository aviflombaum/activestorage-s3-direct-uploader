class CreateTracks < ActiveRecord::Migration[7.1]
  def change
    create_table :tracks do |t|
      t.string :filename
      t.string :title
      t.string :artist_name

      t.timestamps
    end
  end
end
