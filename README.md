# HiCamera

Módulo para gerenciamento de câmera para fotos, vídeos e enviar da galeria para o React Native.

O objetivo do módulo é tornar mais prático o recurso visual de visualizar e selecionar imagens e/ou vídeo do aparelho.

## Gallery

Módulo que retorna as fotos do aparelho. Uso:

```
import {Gallery} from 'HiCamera'
```

##### Props
* [itemStyle](#itemStyle)
* [title](#title)
* [titleStyle](#titleStyle)
* [containerStyle](#containerStyle)
* [galleryType](#galleryType)
* [group](#group)
* [filterBy](#filterBy)
* [selectedStyle](#selectedStyle)
* [selectedComponent](#selectedComponent)
* [maxSelect](#maxSelect)
* [overwriteSelected](#overwriteSelected)


###### itemStyle
`Object` estilo de cada item de mídia a ser apresentado na galeria

###### title
`String` título a ser exibido no topo da galeria (não enviar a propriedade faz com que o título não exista)

###### titleStyle
`Object` estilo do título do componente

###### containerStyle
`Object` estilo de todo componente

###### galleryType
`String` Utilize uma das opções: 'All', 'Photos', 'Videos'
'Photos' é o valor default

###### group
- Album
- All
- Event
- Faces
- Library
- PhotoStream
- SavedPhotos // default

###### filterBy
`String` or `null` Utilize para filtrar o retorno das mídias de acordo com o álbum escolhido.
Exemplo:
```javascript
<TouchableOpacity onPress={() => this.setState({filter: 'MyAlbum'})}>
    <Text>Ver MyAlbum</Text>
</TouchableOpacity>
<Gallery filterBy={this.state.filter} />
```

###### selectedStyle
`Object` Estilo para os items selecionados

###### selectedComponent
`JSX` or `null`
React Component para elemento que aparecerá junto à mídia selecionada.
Recomendo utilizar style com position *absolute*

###### maxSelect
`Number` Máximo de items que podem ser selecionados (default: 1) - precisa ser maior ou igual a 1

###### overwriteSelected
`Boolean` Quando o número máximo de items for maior que 1, você pode escolher o comportamento. 
- `true` quando o número de items ultrapassa o limite, ele começa a substituir os items selecionados, acrescentando o último
- `false` (default) quando o número de items atinge o limite, os próximos toques se tornam sem ação (para selecionar novos) - para desselecionar o toque continua funcionando.

##### Methods
* getAlbums
* selectedItems

###### getAlbums
Método que retorna os albums do dispositivo. Assim, é possível utilizar a propriedade filterBy

Exemplo:
```javascript
_getAlbums(albums){
    this.setState({albums})
}
<Gallery getAlbums={this._getAlbums}>
```

###### selectedItems
Método que retorna um array com os items selecionados.
Exemplo:
```javascript
_selectedItems(items){
    this.setState({itemsSelected: items})
}
<Gallery selectedItems={this._selectedItems}>
```


