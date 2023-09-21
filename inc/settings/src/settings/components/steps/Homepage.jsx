import {useState, useEffect, useContext} from "@wordpress/element";
import {useSelect} from "@wordpress/data";
import {
    Flex,
    FlexItem,
    RadioControl, SelectControl
} from '@wordpress/components';
import {SettingsContext} from "../../context/SettingsContext";
import HomepagePreview from "../partials/HomepagePreview"

const {__} = wp.i18n;

function Homepage() {
    const {settings, updateSetting, pageStart } = useContext(SettingsContext);
    const [homePath, setHomePath] = useState(ollie_options.home_link);
    const [blogPath, setBlogPath] = useState(ollie_options.home_link);
    const [homeDisplay, setHomeDisplay] = useState(ollie_options.homepage_display);
    const [homeId, setHomeId] = useState(ollie_options.home_id);
    const [blogId, setBlogId] = useState(ollie_options.blog_id);
    const [fetchedPages, setFetchedPages] = useState();
    const [showPreview, setShowPreview] = useState(false);

    const pages = useSelect(
        (select) => {
            const {getEntityRecords} = select('core');
            return getEntityRecords('postType', 'page', {
                per_page: -1,
                order: 'asc',
                status: 'publish'
            });
        },
        []
    );

    const getSelectablePages = () => {
        if (!fetchedPages) {
            return [];
        }

        const options = [];

        fetchedPages.map(function (page) {
            if (page.title.raw && page.title.raw !== '') {
                options.push({
                    label: page.title.raw,
                    value: page.id,
                });

            }
            return page;
        });

        return options;
    };

    useEffect(() => {
        // Set focus.
        pageStart.current.focus();

        setFetchedPages(pages);
    }, [settings, pages]);

    return (
        <section>
            <div className="ollie-setting-fields">
                <Flex className="ollie-setting-intro">
                    <FlexItem>
                        <h2 ref={pageStart}>{__('Homepage and Blog', 'ollie')}</h2>
                        <p>{__('Select which pages you\'d like to assign as your homepage and blog page. You can use the pages we just created in the last step.', 'ollie')}</p>
                    </FlexItem>
                </Flex>
                <Flex className="ollie-setting-field">
                    <FlexItem>
                        <label htmlFor="homepage-display">{__('Your homepage displays', 'ollie')}</label>
                        <p>{__('Choose what kind of homepage you\'d like to start with. We\'ll help you edit it after setup.', 'ollie')}</p>
                    </FlexItem>
                    <FlexItem>
                        <RadioControl
                            id="homepage-display"
                            selected={homeDisplay}
                            options={[
                                {label: 'Your latest posts', value: 'posts'},
                                {label: 'A custom page', value: 'page'},
                            ]}
                            onChange={(value) => {
                                setHomeDisplay(value);
                                updateSetting("homepage_display", value);

                                if (value === 'page') {
                                    // We need to update blog and home path now.
                                    if (homeId) {
                                        setHomePath(ollie_options.home_link + '/' + pages.find(page => page.id === parseInt(homeId)).slug);
                                    }

                                    if (blogId) {
                                        setBlogPath(ollie_options.home_link + '/' + pages.find(page => page.id === parseInt(blogId)).slug);
                                    }
                                } else {
                                    setHomePath(ollie_options.home_link);
                                    setBlogPath(ollie_options.home_link);
                                }
                            }}
                        />
                        <Flex className="ollie-homepage-select" gap="15px">
                            {'page' === homeDisplay &&
                                <>
                                    <div className={"page-selector"}>
                                        {pages &&
                                            <SelectControl
                                                label={__('Select homepage', 'content-protector')}
                                                value={settings.home_id}
                                                options={getSelectablePages()}
                                                onChange={(value) => {
                                                    setHomeId(value);
                                                    updateSetting("home_id", value);

                                                    setShowPreview(true);

                                                    // Update path.
                                                    setHomePath(ollie_options.home_link + '/' + pages.find(page => page.id === parseInt(value)).slug);
                                                    setBlogPath(ollie_options.home_link + '/' + pages.find(page => page.id === parseInt(blogId)).slug);
                                                }}
                                            />
                                        }
                                    </div>
                                </>
                            }
                        </Flex>
                    </FlexItem>
                </Flex>
            </div>
            { showPreview &&
                <HomepagePreview home_path={homePath} blog_path={blogPath} blog_id={blogId} homepage_display={homeDisplay}/>
            }

        </section>
    )
}

export default Homepage;
