import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * ブロックの属性を拡張（アニメーション用の属性を追加）
 */
function addAnimationAttributes(settings, name) {
    if (['core/paragraph', 'core/heading', 'core/image'].includes(name)) {
        settings.attributes = Object.assign(settings.attributes, {
            animationType: {
                type: 'string',
                default: ''
            },
            animationDelay: {
                type: 'string',
                default: '0s'
            }
        });
    }
    return settings;
}
addFilter(
    'blocks.registerBlockType',
    'custom-animation/attributes',
    addAnimationAttributes
);

/**
 * サイドバーに「アニメーション設定」を追加
 */
const withAnimationControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (!['core/paragraph', 'core/heading', 'core/image'].includes(props.name)) {
            return <BlockEdit {...props} />;
        }

        const { attributes, setAttributes } = props;
        const { animationType, animationDelay } = attributes;

        return (
            <>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody title={__("アニメーション設定", "custom-animation")} initialOpen={true}>
                        <SelectControl
                            label="アニメーションタイプ"
                            value={animationType}
                            options={[
                                { label: "なし", value: "" },
                                { label: "フェードイン", value: "fade-in" },
                                { label: "スライドイン", value: "slide-in" },
                                { label: "ズームイン", value: "zoom-in" }
                            ]}
                            onChange={(value) => setAttributes({ animationType: value })}
                        />
                        <SelectControl
                            label="遅延時間"
                            value={animationDelay}
                            options={[
                                { label: "なし", value: "0s" },
                                { label: "0.2秒", value: "0.2s" },
                                { label: "0.4秒", value: "0.4s" },
                                { label: "0.6秒", value: "0.6s" }
                            ]}
                            onChange={(value) => setAttributes({ animationDelay: value })}
                        />
                    </PanelBody>
                </InspectorControls>
            </>
        );
    };
}, 'withAnimationControls');

addFilter(
    'editor.BlockEdit',
    'custom-animation/with-animation-controls',
    withAnimationControls
);

/**
 * フロントエンドにアニメーション用のクラスを適用
 */
function applyAnimationClasses(extraProps, blockType, attributes) {
    if (['core/paragraph', 'core/heading', 'core/image'].includes(blockType.name)) {
        if (attributes.animationType) {
            extraProps.className = `${extraProps.className} ${attributes.animationType}`;
            extraProps.style = { ...extraProps.style, transitionDelay: attributes.animationDelay };
        }
    }
    return extraProps;
}
addFilter(
    'blocks.getSaveContent.extraProps',
    'custom-animation/apply-animation-classes',
    applyAnimationClasses
);
