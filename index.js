import React, { Component } from 'react';
import { 
    View, 
    CameraRoll, 
    Platform, 
    PermissionsAndroid, 
    Image,
    FlatList,
    Dimensions,
    TouchableOpacity
} from 'react-native';

const deviceWidth = Dimensions.get('window').width

async function requestStoragePermission() {
    try {
        if( Platform.OS === 'android'){
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                title: 'Acesso ao seu armazenamento de arquivos',
                message:
                    'O app precisa de autorização para baixar e armazenar arquivos offline',
                buttonNeutral: 'Ver depois',
                buttonNegative: 'Cancelar',
                buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        }
    } catch (err) {
        console.log('permissions errors => ', err);
    }
}

export default class HiCamera extends Component{
    render(){
        return(
            <View />
        )
    }
}

class HiGallery extends Component{

    constructor(props){
        super(props);

        this.state = {
            galleryType: props.galleryType || 'Photos',
            group: props.group || 'SavedPhotos',
            title: props.title,
            perPage: props.perPage || 99999,
            columns: props.columns || 4,
            maxSelect: props.maxSelect || 1,
            photos: [],
            selectedItems: [],
            filterBy: props.filterBy,
            maxSelect: props.maxSelect || 1
        }

        this.albums = []

        this.events = {}

        this.styles = {
            itemStyle: this.props.itemStyle || {width: deviceWidth/this.state.columns, height: 200},
            selectedStyle: this.props.selectedStyle || {opacity: 0.5},
            titleStyle: this.props.titleStyle,
            containerStyle: this.props.containerStyle,
        }
        
    }

    
    async componentDidMount(){
        await requestStoragePermission();
        await this.renderPhotos();
        this._getAlbums();
    }

    async renderPhotos(){
        this.setState({selectedItems: []})
        let photos = await CameraRoll.getPhotos({
            first: this.state.perPage,
            assetType: this.state.galleryType,
            groupName: this.state.filterBy
          })
          .then( r => r );
        await this.setState({ after: photos.page_info.end_cursor, photos: photos.edges})
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.filterBy != this.state.filterBy){
            this.setState({filterBy: nextProps.filterBy}, () => this.renderPhotos() )
        }
    }

    async _getMore(){
        let photos = await CameraRoll.getPhotos({
            first: this.state.perPage,
            after: this.state.after,
            assetType: this.state.galleryType
        })
        .then( r => r)
        await this.setState({after: photos.page_info.end_cursor, photos: this.state.photos.concat(photos.edges)})
    }

    _getAlbums(){
        this.albums = this.state.albums;
        let albums = [];
        this.state.photos.map( photo => { if(albums.indexOf(photo.node.group_name) < 0) albums.push( photo.node.group_name) } )
        if(this.props.getAlbums) this.props.getAlbums(albums)
    }

    async _selectItem(item, index){
        let { photos, selectedItems } = this.state;
        if(item.selected){
            photos[index].selected = false;
            selectedItems = selectedItems.filter( select => select !== item)
        } else {
            photos[index].selected = true;
            if(selectedItems.length){
                selectedItems = selectedItems.concat(item);
            }else{
                selectedItems = [item];
            }
        }
        await this.setState({photos, selectedItems})
        if(this.props.selectedItems) this.props.selectedItems(selectedItems)
    }

    unselectAll(){
        selectedItems = [];
        photos = this.state.photos.map( photo => {photo.selected = false; return photo })
        this.setState({selectedItems, photos})
    }

    _renderItem = ({item, index}) =>{
        return (
            <TouchableOpacity onPress={()=> { this._selectItem(item, index) }}>
                <View style={ item.selected? this.styles.selectedStyle : {} } >
                    { item.selected && !!this.props.selectedComponent && this.props.selectedComponent }
                    <Image key={item.node.image.uri} source={{uri: item.node.image.uri}} resizeMode='cover' style={this.styles.itemStyle}/>
                </View>
            </TouchableOpacity>
        )
    }

    _keyExtractor = ( item , index ) => item.node.image.uri

    render(){
        return(
            <View>
                <FlatList
                    extraData={this.state}
                    data={this.state.photos}
                    numColumns = { this.state.columns }
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }
}

export {HiGallery as Gallery};