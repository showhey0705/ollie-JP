const { registerPlugin } = wp.plugins;
const { addFilter } = wp.hooks;
const { PanelBody, SelectControl } = wp.components;
const { createHigherOrderComponent } = wp.compose;
const { InspectorControls } = wp.blockEditor;

// ✅ スクリプトが正しく読み込まれているか確認
console.log("✅ editor.js が読み込まれました！");

// Open Props のアニメーションリスト
const animationOptions = [
    { label: 'なし', value: '' },
    { label: 'フェードイン', value: 'var(--animation-fade-in)' },
    { label: 'スライドダウン', value: 'var(--animation-slide-down)' },
    { label: 'スケールアップ', value: 'var(--animation-scale-up)' },
    { label: '回転イン', value: 'var(--animation-rotate-in)' },
    { label: 'バウンスイン', value: 'var(--animation-bounce-in)' },
];

// 遅延時間の選択肢
const delayOptions = [
    { label: 'なし (0秒)', value: '0s' },
    { label: '0.5秒', value: '0.5s' },
    { label: '1秒', value: '1s' },
    { label: '1.5秒', value: '1.5s' },
    { label: '2秒', value: '2s' },
];

// 🎨 Gutenberg のブロックサイドバーに「アニメーション設定」を追加
const withAnimationControls = createHigherOrderComponent((BlockEdit) => (props) => {
    console.log("✅ withAnimationControls が適用されました！", props);

    if (!props.isSelected) {
        console.log("⚠️ ブロックが選択されていません");
        return <BlockEdit {...props} />;
    }

    console.log("✅ 選択されたブロックの属性:", props.attributes);

    return (
        <>
            <BlockEdit {...props} />
            <InspectorControls>
                <PanelBody title="アニメーション設定">
                    <SelectControl
                        label="アニメーション"
                        value={props.attributes.animationType || ''}
                        options={animationOptions}
                        onChange={(newVal) => props.setAttributes({ animationType: newVal })}
                    />
                    <SelectControl
                        label="遅延時間"
                        value={props.attributes.animationDelay || '0s'}
                        options={delayOptions}
                        onChange={(newVal) => props.setAttributes({ animationDelay: newVal })}
                    />
                </PanelBody>
            </InspectorControls>
        </>
    );
}, 'withAnimationControls');


// 🎯 ブロックにカスタム属性を追加
const addAnimationAttribute = (settings) => {
    console.log("✅ addAnimationAttribute が適用されました！", settings);

    if (!settings.attributes) {
        settings.attributes = {};
    }

    settings.attributes.animationType = {
        type: 'string',
        default: '',
    };

    settings.attributes.animationDelay = {
        type: 'string',
        default: '0s',
    };

    return settings;
};

// ✅ Gutenberg にフィルターを適用
console.log("⚡ addFilter を適用します！");
addFilter('blocks.registerBlockType', 'japonizm/add-animation-attribute', addAnimationAttribute);
addFilter('editor.BlockEdit', 'japonizm/with-animation-controls', withAnimationControls);

console.log("✅ addFilter が適用されました！");
