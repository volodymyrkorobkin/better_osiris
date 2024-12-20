import { StyleSheet } from "react-native";

export default StyleSheet.create({
  text: {
    fontSize: 20,
    fontFamily: "Noto Sans",
  },
  mainWrapper: {
    backgroundColor: "white",
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  webview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "gray",
    color: "white",
    padding: 10,
    borderRadius: 5,
  },
  pressable: {
    color: "white",
    padding: 10,
    borderRadius: 5,
    marginLeft: -10,
  },
  backButton: {
    fontSize: 16,
    color: "gray",
  },
  backShortcut: {
    position: "absolute",
    color: "gray",
    display: "flex",

    borderRadius: "50%",
    backgroundColor: "gray",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: 64,
    right: 20,
    bottom: 30,
  },
  backShortcutButton: {
    fontSize: 48,
    color: "white",
    textAlign: "center",
    marginTop: -6,
  },
  modal: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  border: {
    borderWidth: 0.5,
    borderColor: "gray",
    width: "100%",
    height: "100%",
    borderRadius: 2,
  },
  eventText: {
    fontSize: 11,
  },
  eventHead: {
    fontSize: 14,
    fontWeight: "bold",
  },
  limitHeight: {
    maxHeight: 100,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  flex: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: "gray",
  },
  kleur: {
    width: 35,
    height: 35,
    borderRadius: 10,
  },
  alignCenter: {
    alignItems: "center",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  h1: {
    fontSize: 32,
  },
  h2: {
    fontSize: 24,
  },
  bold: {
    fontWeight: "bold",
  },
  baseMargin: {
    margin: 10,
  },
  cijfers: {
    backgroundColor: "lightblue",
    marginBottom: 2,
  },
  cijfer: {
    fontSize: 24,
    fontWeight: "bold",
    width: 50,
    textAlign: "center",
  },
  gap: {
    gap: 10,
  },
  modalContent: {
    height: "100%",
  },
  gray: {
    color: "gray",
  },
  miniText: {
    fontSize: 16,
  },
  test: {
    borderColor: "red",
    borderWidth: 1,
  },
  flex1: {
    flex: 1,
  },
});
