// ./app/main.js

'use strict';
const electron = require('electron');


/*windows
var ZOOMSDKMOD = require("../lib/zoom_sdk.js")
var initoptions={
  path:'../lib/node_modules/zoomsdk/build/Release/',
  apicallretcb:apicallresultcb,
  threadsafemode:0,
  ostype:ZOOMSDKMOD.ZOOM_TYPE_OS_TYPE.WIN_OS,
}
*/

//mac initoption
var ZOOMSDKMOD = require("./lib/zoom_sdk.js")
var initoptions={
    path:'',
    threadsafemode:0,
    ostype:ZOOMSDKMOD.ZOOM_TYPE_OS_TYPE.MAC_OS,
}
const zoomsdk = ZOOMSDKMOD.ZoomSDK.getInstance(initoptions)
var zoomauth = null
var zoommeeting = null
var zoomaudio = null
var zoomvideo = null
var zoomshare = null
var zoomannotation = null
var zoomuicontroller = null
var mymeetinguserid = 0
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow = null;
var loginWindow = null;
var startjoinWindow = null;
var waitingWindow = null;
var inmeetingWindow = null;

function showAuthwindow(){
  if (!mainWindow)
  {
    mainWindow = new BrowserWindow({ width: 580, height: 300 });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
  }
  if (loginWindow){
    loginWindow.close();
    loginWindow = null;
  }
  if (startjoinWindow){
    startjoinWindow.close();
    startjoinWindow = null;
  }
  if (waitingWindow){
    waitingWindow.close();
    waitingWindow = null;
  }
  if (inmeetingWindow){
    inmeetingWindow.close();
    inmeetingWindow = null;
  }
}

function showLoginWindow(){
  if (!loginWindow)
  {
    loginWindow = new BrowserWindow({ width: 580, height: 300 });
    loginWindow.loadURL('file://' + __dirname + '/login.html');
  }
  if (mainWindow){
    mainWindow.close();
    mainWindow = null;
  }
  if (startjoinWindow){
    startjoinWindow.close();
    startjoinWindow = null;
  }
  if (waitingWindow){
    waitingWindow.close();
    waitingWindow = null;
  }
  if (inmeetingWindow){
    inmeetingWindow.close();
    inmeetingWindow = null;
  }
}

function showSatrtJoinWindow(){
  if (!startjoinWindow)
  {
    startjoinWindow = new BrowserWindow({ width: 580, height: 300 });
    startjoinWindow.loadURL('file://' + __dirname + '/start_join.html'); 
  }
  if (mainWindow){
    mainWindow.close();
    mainWindow = null;
  }
  if (loginWindow){
    loginWindow.close();
    loginWindow = null;
  }
  if (waitingWindow){
    waitingWindow.close();
    waitingWindow = null;
  }
  if (inmeetingWindow){
    inmeetingWindow.close();
    inmeetingWindow = null;
  }
}

function showWaitingWindow(){
  if (!waitingWindow)
  {
    waitingWindow = new BrowserWindow({ width: 580, height: 300 });
    waitingWindow.loadURL('file://' + __dirname + '/waiting.html');
  }
  if (mainWindow){
    mainWindow.close();
    mainWindow = null;
  }
  if (loginWindow){
    loginWindow.close();
    loginWindow = null;
  }
  if (startjoinWindow){
    startjoinWindow.close();
    startjoinWindow = null;
  }
  if (inmeetingWindow){
    inmeetingWindow.close();
    inmeetingWindow = null;
  }
}

function showInMeetingWindow(){

  if (!inmeetingWindow)
  {
    inmeetingWindow = new BrowserWindow({ width: 580, height: 300 });
    inmeetingWindow.loadURL('file://' + __dirname + '/inmeeting.html');
  }
  if (mainWindow){
    mainWindow.close();
    mainWindow = null;
  }
  if (loginWindow){
    loginWindow.close();
    loginWindow = null;
  }
  if (startjoinWindow){
    startjoinWindow.close();
    startjoinWindow = null;
  }
  if (waitingWindow){
    waitingWindow.close();
    waitingWindow = null;
  }
}

function ProcSDKReady(){
  showAuthwindow()
    var options={
      authcb:sdkauthCB,
      logincb:loginretCB,
      logoutcb:null,
  }
  zoomauth = zoomsdk.GetAuth(options)
}

function apicallresultcb(apiname, ret){
  if ('InitSDK' == apiname && ZOOMSDKMOD.ZoomSDKError.SDKERR_SUCCESS == ret){
    ProcSDKReady()
  }
  else if ('CleanupSDK' == apiname){
     app.quit();
  }
}

function sdkauthCB(status){
  if (ZOOMSDKMOD.ZOOMAUTHMOD.ZoomAuthResult.AUTHRET_SUCCESS == status){
    var opts = {
      ostype:ZOOMSDKMOD.ZOOM_TYPE_OS_TYPE.MAC_OS,
      meetingstatuscb:meetingstatuscb,
      meetinguserjoincb:meetinguserjoincb,
      meetinguserleftcb:meetinguserleftcb,
      meetinghostchangecb:meetinghostchangecb,
    }
    zoommeeting = zoomsdk.GetMeeting(opts)

    var optsaudio = {
      audiostatuscb:audiostatuscb,
    }
    zoomaudio = zoommeeting.GetMeetingAudio(optsaudio)

    var optsvideo = {
      videostatuscb:videostatuscb,
    }
    zoomvideo = zoommeeting.GetMeetingVideo(optsvideo)

    zoomshare = zoommeeting.GetMeetingShare()
    
    zoomannotation = zoommeeting.GetAnnotationCtrl()
    zoomuicontroller = zoommeeting.GetMeetingUICtrl()
    showLoginWindow();
  }
  else {
    showAuthwindow();
  }
}

function sdkauth(appkey, appsecret){
  zoomauth.SDKAuth(appkey, appsecret)
  showWaitingWindow();
}

function loginretCB(status){
  switch(status)
  {
    case ZOOMSDKMOD.ZOOMAUTHMOD.ZoomLoginStatus.LOGIN_SUCCESS:
      showSatrtJoinWindow();
    break;
    case ZOOMSDKMOD.ZOOMAUTHMOD.ZoomLoginStatus.LOGIN_PROCESSING:
      showWaitingWindow();
    break;
    case ZOOMSDKMOD.ZOOMAUTHMOD.ZoomLoginStatus.LOGIN_FAILED:
      showLoginWindow();
    break;
    default:
    break;
  }
}
function login(username, psw){
  if (username && psw)
  {
    showWaitingWindow();
  }
  zoomauth.Login(username, psw, false);
}

function audiostatuscb(userid, status){

}

function videostatuscb(userid, status){

}
function meetinguserjoincb(useritem) {
  if (useritem.isme == 'true')
    mymeetinguserid = useritem.userid
}

 function meetinguserleftcb(userid){

 }

function meetinghostchangecb(userid){

}

function meetingstatuscb(status, errorcode) {

  switch (status)
  {
    case ZOOMSDKMOD.ZOOMMEETINGMOD.ZoomMeetingStatus.MEETING_STATUS_CONNECTING:
    case ZOOMSDKMOD.ZOOMMEETINGMOD.ZoomMeetingStatus.MEETING_STATUS_DISCONNECTING:
    case ZOOMSDKMOD.ZOOMMEETINGMOD.ZoomMeetingStatus.MEETING_STATUS_RECONNECTING:
      showWaitingWindow();
    break;
    case ZOOMSDKMOD.ZOOMMEETINGMOD.ZoomMeetingStatus.MEETING_STATUS_INMEETING:
    case ZOOMSDKMOD.ZOOMMEETINGMOD.ZoomMeetingStatus.MEETING_STATUS_AUDIO_READY:
      showInMeetingWindow();
    break;
    case ZOOMSDKMOD.ZOOMMEETINGMOD.ZoomMeetingStatus.MEETING_STATUS_FAILED:
    case ZOOMSDKMOD.ZOOMMEETINGMOD.ZoomMeetingStatus.MEETING_STATUS_ENDED:
    /*
      if (ZOOMSDKMOD.ZOOMMEETINGMOD.ZoomMeetingStatus.MEETING_STATUS_FAILED == status) {
        switch (errorcode)
        {
          case ZOOMSDKMOD.ZOOMMEETINGMOD.ZoomMeetingFailCode.MEETING_FAIL_CONFLOCKED:
          .....
          {

          }
          break;
          default
          break;
        }
      }
      */
      showSatrtJoinWindow();
    break;
    default:
    break;
  }
}
function start(meetingnum){
  var opt = {
    meetingnum:meetingnum
  }
  zoommeeting.StartMeeting(opt);
}

function join(meetingnum, username){
   var opt = {
    meetingnum:meetingnum,
    username:username
  }
  zoommeeting.JoinMeeting(opt);
}

function leave(endMeeting){
    //zoomaudio.MeetingAudio_JoinVoip()
    /*
    var mute = {
      userid:mymeetinguserid,
      allowunmutebyself:true // only take affect when userid===0, host muteall
    }
    zoomaudio.MeetingAudio_MuteAudio(mute)
    */
    /*
    var unmute = {
      userid: mymeetinguserid,
    }
    zoomaudio.MeetingAudio_UnMuteAudio(unmute)
    */
    //zoomaudio.MeetingAudio_LeaveVoip()
    //zoomvideo.MeetingVideo_MuteVideo()
    //zoomvideo.MeetingVideo_UnMuteVideo()

    //var userlist = zoommeeting.GetUserList()

    /*
    var shareapp = {
      apphandle:134484 //app mainwindow handle.
    }
    zoomshare.MeetingShare_StartAppShare(shareapp)
    */
    //return
    var opt = {
      endMeeting:endMeeting
    }
   zoommeeting.LeaveMeeting(opt);
}

function mute(userid)
{
  var opts = {
    userid: userid,
    allowunmutebyself: 'false'
  }
  
  zoomaudio.MeetingAudio_MuteAudio(opts)
}

function unmute(userid)
{
  var opts = {
    userid: userid,
  }
  zoomaudio.MeetingAudio_UnMuteAudio(opts)
}

function joinVoip()
{
  var opts = {}
  zoomaudio.MeetingAudio_JoinVoip(opts)
}

function leaveVoip()
{
  var opts = {}
  zoomaudio.MeetingAudio_LeaveVoip(opts)
}

function muteVideo()
{
   var opts = {}
  zoomvideo.MeetingVideo_MuteVideo(opts)
}

function unmuteVideo()
{
   var opts = {}
  zoomvideo.MeetingVideo_UnMuteVideo(opts)
}

function shareApp(apphandle)
{
  var opts={
   apphandle:apphandle
  }
  zoomshare.MeetingShare_StartAppShare(opts)
}

function shareDesktop(monitorid)
{
  var opts={
   monitorid:monitorid
  }
  zoomshare.MeetingShare_StartMonitorShare(opts)
}

function stopShare(){
  var opts={}
  zoomshare.MeetingShare_StopShare(opts)
}

function setTool(viewtype, tooltype)
{
  var opts ={
    viewtype: viewtype,
    type:tooltype
  }
  zoomannotation.Annotaion_SetTool(opts)
}

function setClear(viewtype, cleartype)
{
  var opts ={
    viewtype: viewtype,
    type:cleartype
  }
  zoomannotation.Annotaion_Clear(opts)
}

function undo(viewtype)
{
  var opts ={
    viewtype: viewtype,
  }
  zoomannotation.Annotaion_Undo(opts)
}

function redo(viewtype)
{
  var opts ={
    viewtype: viewtype,
  }
  zoomannotation.Annotaion_Redo(opts)
}

function startAnnotation(viewtype, left, top)
{
  var opts ={
    viewtype: viewtype,
    left:left,
    top: top,
  }
  zoomannotation.Annotaion_StartAnnotation(opts)
}

function stopAnnotation(viewtype)
{
  zoomannotation.Annotaion_StopAnnotation(viewtype)
}

function showAudio(show)
{
  if(show)
    zoomuicontroller.MeetingUI_ShowJoinAudioDlg()
  else
    zoomuicontroller.MeetingUI_HideJoinAudioDlg()
}

function showChat(show)
{
  var opts ={
    left: 200,
    top: 200
  }
  if(show)
    zoomuicontroller.MeetingUI_ShowChatDlg(opts)
  else
    zoomuicontroller.MeetingUI_HideChatDlg()
}

function showPlist(show)
{
  var opts ={
    show:show
  }
  zoomuicontroller.MeetingUI_ShowParticipantsListWnd(opts)

}

function showToolbar(show)
{
  var opts ={
    show:show
  }
  zoomuicontroller.MeetingUI_ShowBottomFloatToolbarWnd(opts)
}

function showFitbar(show)
{
  var opts ={
    show:show
  }
  zoomuicontroller.MeetingUI_ShowSharingToolbar(opts)
}

function enterFullscreen(show)
{
  var opts ={
    bFirstView: 1,
    bSecView:0
  }
  if(show)
  {
    zoomuicontroller.MeetingUI_EnterFullScreen(opts)
  }else{
    zoomuicontroller.MeetingUI_ExitFullScreen(opts)
  }
}

function switchToWall()
{
  zoomuicontroller.MeetingUI_SwitchToVideoWall()
}

function switchToActive()
{
  zoomuicontroller.MeetingUI_SwtichToAcitveSpeaker()
}

function switchFloatToActive()
{
  zoomuicontroller.MeetingUI_SwitchFloatVideoToActiveSpkMod()
}

function switchFloatToGallery()
{
  zoomuicontroller.MeetingUI_SwitchFloatVideoToGalleryMod()
}

function switchFloatToActive()
{
  zoomuicontroller.MeetingUI_SwitchFloatVideoToActiveSpkMod()
}

function changeFloatActiveSpkVideoSize()
{
  var opts = {
    floatvideotype:2
  }
  zoomuicontroller.MeetingUI_ChangeFloatActiveSpkVideoSize(opts)
}

function moveFloatVideo()
{
  var opts ={
    left: 200,
    top: 200
  }
  zoomuicontroller.MeetingUI_MoveFloatVideoWnd(opts)
}


const {ipcMain} = require('electron')
ipcMain.on('asynchronous-message', (event, arg1, arg2, arg3) => {
  if ('sdkauth' == arg1){
    sdkauth(arg2, arg3)
  }
  else if ('login' == arg1){
    login(arg2,arg3)
  }
  else if ('start' == arg1){
    start(Number(arg2))
  }
  else if ('join' == arg1){
    join(Number(arg2), arg3);
  }
  else if ('leave' == arg1){
    leave(false)
  }
  else if ('end' == arg1){
    leave(true)
  }
  else if ('mute' == arg1){
    mute(Number(arg2))
  }
  else if('unmute'== arg1){
    unmute(Number(arg2))
  }
  else if('joinVoip'== arg1){
    joinVoip()
  }
  else if('leaveVoip'== arg1){
    leaveVoip()
  }
  else if('muteVideo'== arg1){
    muteVideo()
  }
  else if('unmuteVideo'== arg1){
    unmuteVideo()
  }
  else if('shareApp'== arg1){
    shareApp(Number(arg2))
  }
  else if('shareDesktop'== arg1){
    shareDesktop(Number(arg2))
  }
  else if('stopShare'== arg1){
    stopShare()
  } 
  else if('setTool'== arg1){
    setTool(Number(arg2), Number(arg3))
  }
  else if('setClear'== arg1){
    setClear(Number(arg2), Number(arg3))
  }
  else if('undo'== arg1){
    undo(Number(arg2))
  }
  else if('redo'== arg1){
    redo(Number(arg2))
  }
  else if('startAnnotation'== arg1){
    startAnnotation(Number(arg2), 300, 300)
  }
  else if('stopAnnotation'== arg1){
    stopAnnotation(Number(arg2))
  }
  else if('showAudio'== arg1){
    showAudio(Number(arg2))
  }
  else if('showChat'== arg1){
    showChat(Number(arg2))
  }
  else if('showPlist'== arg1){
    showPlist(Number(arg2))
  }
  else if('showToolbar'== arg1){
    showToolbar(Number(arg2))
  }
  else if('showFitbar'== arg1){
    showFitbar(Number(arg2))
  }
  else if('enterFullscreen'== arg1){
    enterFullscreen(Number(arg2))
  }
  else if('switchToWall'== arg1){
    switchToWall()
  }
  else if('switchToActive'== arg1){
    switchToActive()
  }
  else if('switchFloatToActive'== arg1){
    switchFloatToActive()
  }
  else if('switchFloatToGallery'== arg1){
    switchFloatToGallery()
  }
  else if('changeFloatActiveSpkVideoSize'== arg1){
    changeFloatActiveSpkVideoSize()
  }
  else if('moveFloatVideo'== arg1){
    moveFloatVideo()
  }

})

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    zoomsdk.StopMonitorUIAction()
    zoomsdk.CleanupSDK()
    if (0 == initoptions.threadsafemode){
      app.quit()
    }
  }
});


function uiacitoncb(type, msgid, hwnd){

  }

app.on('ready', function () {
  var opts = {
    webdomain:'https://www.zoom.us',
    langid:ZOOMSDKMOD.ZoomSDK_LANGUAGE_ID.LANGUAGE_English,
  }
  var ret = zoomsdk.InitSDK(opts);
  var optMonitorUIAction={
    uiacitonCB:uiacitoncb
  }

  /* windows need do
  zoomsdk.StartMonitorUIAction(optMonitorUIAction)
  */
  if (0 == initoptions.threadsafemode && ZOOMSDKMOD.ZoomSDKError.SDKERR_SUCCESS == ret){
    ProcSDKReady()
  }
});