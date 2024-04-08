import { App, Editor, MarkdownView, ItemView, Modal, Workspace, WorkspaceLeaf, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { 
	ViewUpdate,
	PluginValue,
	EditorView,
	ViewPlugin,
	 } from '@codemirror/view';
	// @ts-expect-error, not typed
const editorView = view.editor.cm as EditorView;
import { syntaxTree } from "@codemirror/language";
import { CodeMirror } from "codemirror";
import { showMinimap } from "@replit/codemirror-minimap";
import { ExampleView, VIEW_TYPE_EXAMPLE } from "./view";

Plugin.registerEditorExtension(showMinimap: Codemirror Minimap); void;
Workspace.updateOptions(): void;


const 
export class MinimapO extends Plugin{
	onload() {
		const ext = this.buildMinimapOPlugin();
		this.registerEditorExtension(MinimapO);
	}

	buildMinimapOPlugin() {

		let create = (v: EditorView) => {
			const dom = document.createElement('div');
			return { dom }
		}

		let view = new EditorView({
			doc: "",
			extensions: [ CodeMirror,
				showMinimap.compute(['doc'], (state) => {
					return {
						create,
        /* optional */
        displayText: 'blocks',
        showOverlay: 'always',
        gutters: [ { 1: '#00FF00', 2: '#00FF00' } ],
      }
    }),
  ],
  parent: document.querySelector('#editor'),
})
this.registerView(
	VIEW_TYPE_EXAMPLE,
	(leaf) => new MinimapView(leaf,)
)

class MinimapO implements PluginValue {
	constructor(view: EditorView) {

	}

	update(update: ViewUpdate) {

	}

	destroy() {

	}
}

export const minimapO = ViewPlugin.fromClass(MinimapO);
export class MinimapView extends EditorView {
	constructor(leaf: WorkspaceLeaf, param: type_of_param) {
		super(leaf);
		this.param=param;
	}
}
	}

	getDisplayName(): string {
		return "Show Minimap";
	  };
	  getIcon(): string {
		return "apple";
	  }
}

onload (){
	console.log ('loading plugin: Minimap O');
	registerView(type: string, viewCreator: ViewCreator): void;
}

this.addCommand({
	id: 'open-minimap',
	name: 'Open minimap',
	editorCallback: (editor, view) => {

// @ts-expect-error, not typed
const editorView = view.editor.cm as EditorView;

const plugin = editorView.plugin(minimapO);
if (plugin) {
	plugin.addPointerToSelection(editorView);
		new SampleModal(this.app).open();
	}
},});

// Remember to rename these classes and interfaces!

interface MinimapOSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MinimapOSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MinimapOSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Minimap O', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
