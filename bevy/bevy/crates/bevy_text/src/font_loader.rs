use crate::Font;
use bevy_asset::{io::Reader, AssetLoader, LoadContext};
use derive_more::derive::{Display, Error, From};

#[derive(Default)]
/// An [`AssetLoader`] for [`Font`]s, for use by the [`AssetServer`](bevy_asset::AssetServer)
pub struct FontLoader;

/// Possible errors that can be produced by [`FontLoader`]
#[non_exhaustive]
#[derive(Debug, Error, Display, From)]
pub enum FontLoaderError {
    /// The contents that could not be parsed
    Content(cosmic_text::ttf_parser::FaceParsingError),
    /// An [IO](std::io) Error
    Io(std::io::Error),
}

impl AssetLoader for FontLoader {
    type Asset = Font;
    type Settings = ();
    type Error = FontLoaderError;
    async fn load(
        &self,
        reader: &mut dyn Reader,
        _settings: &(),
        _load_context: &mut LoadContext<'_>,
    ) -> Result<Font, Self::Error> {
        let mut bytes = Vec::new();
        reader.read_to_end(&mut bytes).await?;
        let font = Font::try_from_bytes(bytes)?;
        Ok(font)
    }

    fn extensions(&self) -> &[&str] {
        &["ttf", "otf"]
    }
}