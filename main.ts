import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import {
	ViewUpdate,
	PluginValue,
	EditorView,
	drawSelection,
	ViewPlugin,
} from "@codemirror/view"
import { EditorState, Compartment, StateEffect, StateField } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { linter, Diagnostic } from "@codemirror/lint";

import snippets from "./snippets";
import { showMinimap } from "src/index.ts";

const BasicExtensions = [
	basicSetup,
	javascript(),
	drawSelection(),
	EditorState.allowMultipleSelections.of(true),
	EditorView.contentAttributes.of({
	  /* Disabling grammarly */
	  "data-gramm": "false",
	  "data-gramm_editor": "false",
	  "data-enabled-grammarly": "false",
	})
  ]

  class MinimapPlugin implements PluginValue {
	constructor(view: EditorView) {
	  // ...
	}

	update(update: ViewUpdate) {
		// ...
	  }
	
	  destroy() {
		// ...
	  }
	}
	
	export const minimapPlugin = ViewPlugin.fromClass(MinimapPlugin);

  const setShownState = StateEffect.define<boolean>();
  const shownState = StateField.define<boolean>({
	create: () => getShowMinimap(window.location.hash),
	update: (v, tr) => {
	  for (const ef of tr.effects) {
		if (ef.is(setShownState)) {
		  v = ef.value;
		}
	  }
	  return v;
	}
  });
  
  const setOverlayState = StateEffect.define<"always" | "mouse-over" | undefined>();
  const overlayState = StateField.define<"always" | "mouse-over" | undefined>({
	create: () => getShowOverlay(window.location.hash),
	update: (v, tr) => {
	  for (const ef of tr.effects) {
		if (ef.is(setOverlayState)) {
		  v = ef.value;
		}
	  }
	  return v;
	}
  });
  
  const setDisplayTextState = StateEffect.define<"blocks" | "characters" | undefined>();
  const displayTextState = StateField.define<"blocks" | "characters" | undefined>({
	create: () => getDisplayText(window.location.hash),
	update: (v, tr) => {
	  for (const ef of tr.effects) {
		if (ef.is(setDisplayTextState)) {
		  v = ef.value;
		}
	  }
	  return v;
	}
  });
  
  const wrapCompartment = new Compartment();
  function maybeWrap() {
	return getLineWrap(window.location.hash) ? EditorView.lineWrapping : []
  }
  
  const diffState = StateField.define<{ original: string, changes: Array<Change> }>({
	create: state => ({ original: state.doc.toString(), changes: [] }),
	update: (value, tr) => {
	  if (!tr.docChanged) {
		return value;
	  }
  
	  return {
		original: value.original,
		changes: Array.from(diff(value.original, tr.state.doc.toString()))
	  };
	}
  });
  
  
  const view = new EditorView({
	state: EditorState.create({
	  doc: getDoc(window.location.hash),
	  extensions: [
		BasicExtensions,
  
		[
		  shownState,
		  diffState,
		  overlayState,
		  displayTextState,
		  wrapCompartment.of(maybeWrap()),
		],
  
		showMinimap.compute([shownState, diffState, overlayState, displayTextState], (s) => {
		  if (!s.field(shownState, false)) {
			return null;
		  }
  
		  const create = () => {
			const dom = document.createElement('div');
			return { dom };
		  }
  
		  const showOverlay = s.field(overlayState, false);
		  const displayText = s.field(displayTextState, false);
  
		  // TODO convert diffState -> changed line information
		  // I'm just mocking this in for now
		  const gutter: Record<number, string> = {};
		  for (let i = 0; i < s.doc.lines; i++) {
			gutter[i] = 'green'
		  }
  
		  return { create, showOverlay, displayText, gutters: [gutter] }
		}),
	  ],
	}),
	parent: document.getElementById("editor") as HTMLElement,
  });
  
  /* Listen to changes and apply updates from controls */
  window.addEventListener("hashchange", (e: HashChangeEvent) => {
	view.dispatch({
	  changes: { from: 0, to: view.state.doc.length, insert: getDoc(e.newURL) },
	  effects: [
		setShownState.of(getShowMinimap(e.newURL)),
		setOverlayState.of(getShowOverlay(e.newURL)),
		setDisplayTextState.of(getDisplayText(e.newURL)),
		wrapCompartment.reconfigure(maybeWrap()),
	  ]
	})
  });
  
  
  /* Helpers */
  function getDoc(url: string): string {
	const length = getHashValue("length", url);
  
	if (length && length in snippets) {
	  return snippets[length];
	}
  
	return snippets.long;
  }
  function getShowMinimap(url: string): boolean {
	return getHashValue("minimap", url) !== "hide";
  }
  function getShowOverlay(url: string): "always" | "mouse-over" | undefined {
	const value = getHashValue("overlay", url);
	if (value === "always" || value === "mouse-over") {
	  return value;
	}
  
	return undefined;
  }
  function getDisplayText(url: string): "blocks" | "characters" | undefined {
	const value = getHashValue("text", url);
	if (value === "blocks" || value === "characters") {
	  return value;
	}
  
	return undefined;
  }
  function getLineWrap(url: string): boolean {
	const value = getHashValue("wrapping", url);
	return value == "wrap";
  }
  function getMode(url: string): "dark" | "light" {
	return getHashValue("mode", url) === "dark" ? "dark" : "light";
  }
  function getLintingEnabled(url: string): boolean {
	return getHashValue("linting", url) === "disabled" ? false : true;
  }
  function getHashValue(key: string, url: string): string | undefined {
	const hash = url.split("#").slice(1);
	const pair = hash.find((kv) => kv.startsWith(`${key}=`));
	return pair ? pair.split("=").slice(1)[0] : undefined;
  }

// Remember to rename these classes and interfaces!

interface MinimapPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MinimapPluginSettings = {
	mySetting: 'default'
}

export default class HelloWorldPlugin extends Plugin {
	settings: MinimapPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});

		this.addRibbonIcon('dice', 'Greet', () => {
			new Notice('Hello, world!');
		  });

		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

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
